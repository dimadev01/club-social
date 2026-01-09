import {
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';
import {
  MovementCategory,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';
import { Inject } from '@nestjs/common';
import { sumBy } from 'es-toolkit/compat';

import type { Result } from '@/shared/domain/result';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import { MemberLedgerEntryEntity } from '@/members/ledger/domain/member-ledger-entry.entity';
import {
  MEMBER_LEDGER_REPOSITORY_PROVIDER,
  type MemberLedgerRepository,
} from '@/members/ledger/member-ledger.repository';
import { MovementEntity } from '@/movements/domain/entities/movement.entity';
import { PaymentEntity } from '@/payments/domain/entities/payment.entity';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { Guard } from '@/shared/domain/guards';
import { err, ok, ResultUtils } from '@/shared/domain/result';
import {
  UNIT_OF_WORK_PROVIDER,
  type UnitOfWork,
} from '@/shared/domain/unit-of-work';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

interface CreatePaymentDueParams {
  amount: number;
  amountFromBalance: null | number;
  dueId: string;
}

interface CreatePaymentParams {
  createdBy: string;
  date: string;
  dues: CreatePaymentDueParams[];
  memberId: string;
  notes: null | string;
  receiptNumber: null | string;
  surplusToCreditAmount: null | number;
}

export class CreatePaymentUseCase extends UseCase<PaymentEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    @Inject(MEMBER_LEDGER_REPOSITORY_PROVIDER)
    private readonly memberLedgerRepository: MemberLedgerRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(
    params: CreatePaymentParams,
  ): Promise<Result<PaymentEntity>> {
    this.logger.info({
      message: 'Creating payment',
      params,
    });

    const memberId = UniqueId.raw({ value: params.memberId });

    // Dues validation
    const dues = await this.dueRepository.findByIds(
      params.dues.map((pd) => UniqueId.raw({ value: pd.dueId })),
    );

    // Sufficient balance validation
    const sufficientBalanceValidation =
      await this.validateSufficientBalance(params);

    if (sufficientBalanceValidation.isErr()) {
      return err(sufficientBalanceValidation.error);
    }

    const results = ResultUtils.combine([
      Amount.fromCents(sumBy(params.dues, (pd) => pd.amount)),
      DateOnly.fromString(params.date),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [paymentAmount, paymentDate] = results.value;

    // Payment creation
    const payment = PaymentEntity.create(
      {
        amount: paymentAmount,
        date: paymentDate,
        dueIds: params.dues.map((pd) => UniqueId.raw({ value: pd.dueId })),
        memberId,
        notes: params.notes,
        receiptNumber: params.receiptNumber,
      },
      params.createdBy,
    );

    if (payment.isErr()) {
      return err(payment.error);
    }

    /**
     * Business reason:
     * For every payment registered, we must create corresponding member ledger entries
     * to accurately reflect financial activity. This ensures double-entry accounting:
     * - A deposit (credit) entry records the reception of the total payment ("abono" to the account).
     * - For each due being paid, a corresponding debit entry is posted to represent the applied payment
     *   against each specific due ("aplicar cuota"). This allows granular tracking of which dues are
     *   cleared, supports reporting, and maintains an auditable ledger history per member.
     * The member ledger must always remain balanced: sum of credits minus debits must align with outstanding dues and payments.
     */
    const creditEntry = MemberLedgerEntryEntity.create(
      {
        amount: payment.value.amount,
        date: paymentDate,
        memberId,
        notes: params.notes,
        paymentId: payment.value.id,
        reversalOfId: null,
        source: MemberLedgerEntrySource.PAYMENT,
        status: MemberLedgerEntryStatus.POSTED,
        type: MemberLedgerEntryType.DEPOSIT_CREDIT,
      },
      params.createdBy,
    );

    if (creditEntry.isErr()) {
      return err(creditEntry.error);
    }

    const creditMovement = MovementEntity.create(
      {
        amount: creditEntry.value.amount,
        category: MovementCategory.MEMBER_LEDGER,
        date: paymentDate,
        mode: MovementMode.AUTOMATIC,
        notes: 'Pago de deuda',
        paymentId: payment.value.id,
        status: MovementStatus.REGISTERED,
      },
      params.createdBy,
    );

    if (creditMovement.isErr()) {
      return err(creditMovement.error);
    }

    // This holds the credit movement by entering or surplus
    const movements: MovementEntity[] = [creditMovement.value];

    // This holds the cash and balance debit ledger entries
    const debitLedgerEntries: MemberLedgerEntryEntity[] = [];

    for (const due of dues) {
      const dueFromParams = params.dues.find((d) => d.dueId === due.id.value);
      Guard.defined(dueFromParams);

      const cashAmountResult = Amount.fromCents(dueFromParams.amount);

      if (cashAmountResult.isErr()) {
        return err(cashAmountResult.error);
      }

      const cashAmount: Amount = cashAmountResult.value;
      let balanceAmount: Amount | null = null;

      if (dueFromParams.amountFromBalance) {
        const balanceAmountResult = SignedAmount.fromCents(
          dueFromParams.amountFromBalance,
        );

        if (balanceAmountResult.isErr()) {
          return err(balanceAmountResult.error);
        }

        balanceAmount = balanceAmountResult.value;
      }

      const totalAmount = cashAmount.add(balanceAmount ?? SignedAmount.ZERO);

      /**
       * Validate that between the cash amount and balance
       * amount is not greater than the due amount
       */
      if (totalAmount.isGreaterThan(due.pendingAmount)) {
        return err(
          new ApplicationError(
            'El monto a registrar no puede ser mayor al monto pendiente de la cuota',
          ),
        );
      }

      const cashDebitEntry = MemberLedgerEntryEntity.create(
        {
          amount: cashAmountResult.value.toNegative(),
          date: paymentDate,
          memberId: UniqueId.raw({ value: params.memberId }),
          notes: params.notes,
          paymentId: payment.value.id,
          reversalOfId: null,
          source: MemberLedgerEntrySource.PAYMENT,
          status: MemberLedgerEntryStatus.POSTED,
          type: MemberLedgerEntryType.DUE_APPLY_DEBIT,
        },
        params.createdBy,
      );

      if (cashDebitEntry.isErr()) {
        return err(cashDebitEntry.error);
      }

      debitLedgerEntries.push(cashDebitEntry.value);

      const dueApplySettlementResult = due.applySettlement({
        amount: cashAmountResult.value,
        createdBy: params.createdBy,
        memberLedgerEntryId: cashDebitEntry.value.id,
        paymentId: payment.value.id,
      });

      if (dueApplySettlementResult.isErr()) {
        return err(dueApplySettlementResult.error);
      }

      // If the due has an amount from balance, use it
      if (balanceAmount) {
        const balanceDebitEntry = MemberLedgerEntryEntity.create(
          {
            amount: balanceAmount.toNegative(),
            date: paymentDate,
            memberId,
            notes: params.notes,
            paymentId: payment.value.id,
            reversalOfId: null,
            source: MemberLedgerEntrySource.PAYMENT,
            status: MemberLedgerEntryStatus.POSTED,
            type: MemberLedgerEntryType.BALANCE_APPLY_DEBIT,
          },
          params.createdBy,
        );

        if (balanceDebitEntry.isErr()) {
          return err(balanceDebitEntry.error);
        }

        debitLedgerEntries.push(balanceDebitEntry.value);

        const dueApplySettlementResult = due.applySettlement({
          amount: balanceAmount,
          createdBy: params.createdBy,
          memberLedgerEntryId: balanceDebitEntry.value.id,
          paymentId: payment.value.id,
        });

        if (dueApplySettlementResult.isErr()) {
          return err(dueApplySettlementResult.error);
        }
      }
    }

    // Surplus credit entry creation
    let surplusCreditEntry: MemberLedgerEntryEntity | null = null;

    if (params.surplusToCreditAmount) {
      const surplusCreditAmount = SignedAmount.fromCents(
        params.surplusToCreditAmount,
      );

      if (surplusCreditAmount.isErr()) {
        return err(surplusCreditAmount.error);
      }

      const surplusCreditEntryResult = MemberLedgerEntryEntity.create(
        {
          amount: surplusCreditAmount.value,
          date: paymentDate,
          memberId: UniqueId.raw({ value: params.memberId }),
          notes: params.notes,
          paymentId: payment.value.id,
          reversalOfId: null,
          source: MemberLedgerEntrySource.PAYMENT,
          status: MemberLedgerEntryStatus.POSTED,
          type: MemberLedgerEntryType.DEPOSIT_CREDIT,
        },
        params.createdBy,
      );

      if (surplusCreditEntryResult.isErr()) {
        return err(surplusCreditEntryResult.error);
      }

      surplusCreditEntry = surplusCreditEntryResult.value;

      const surplusCreditMovement = MovementEntity.create(
        {
          amount: surplusCreditEntryResult.value.amount,
          category: MovementCategory.MEMBER_LEDGER,
          date: paymentDate,
          mode: MovementMode.AUTOMATIC,
          notes: null,
          paymentId: payment.value.id,
          status: MovementStatus.REGISTERED,
        },
        params.createdBy,
      );

      if (surplusCreditMovement.isErr()) {
        return err(surplusCreditMovement.error);
      }

      movements.push(surplusCreditMovement.value);
    }

    await this.unitOfWork.execute(
      async ({
        duesRepository,
        memberLedgerRepository,
        movementsRepository,
        paymentsRepository,
      }) => {
        await paymentsRepository.save(payment.value);
        await memberLedgerRepository.save(creditEntry.value);
        await Promise.all(
          debitLedgerEntries.map((entry) => memberLedgerRepository.save(entry)),
        );

        if (surplusCreditEntry) {
          await memberLedgerRepository.save(surplusCreditEntry);
        }

        await Promise.all(dues.map((due) => duesRepository.save(due)));
        await Promise.all(
          movements.map((movement) => movementsRepository.save(movement)),
        );
      },
    );

    this.eventPublisher.dispatch(payment.value);
    this.eventPublisher.dispatch(creditEntry.value);
    debitLedgerEntries.forEach((entry) => this.eventPublisher.dispatch(entry));

    if (surplusCreditEntry) {
      this.eventPublisher.dispatch(surplusCreditEntry);
    }

    dues.forEach((due) => this.eventPublisher.dispatch(due));
    movements.forEach((movement) => this.eventPublisher.dispatch(movement));

    return ok(payment.value);
  }

  private async validateSufficientBalance(
    params: CreatePaymentParams,
  ): Promise<Result> {
    const amountFromBalanceSum = sumBy(
      params.dues,
      (d) => d.amountFromBalance ?? 0,
    );

    if (amountFromBalanceSum === 0) {
      return ok();
    }

    const amountFromBalance = Amount.fromCents(amountFromBalanceSum);

    if (amountFromBalance.isErr()) {
      return err(amountFromBalance.error);
    }

    const memberBalance =
      await this.memberLedgerRepository.getBalanceByMemberId(
        UniqueId.raw({ value: params.memberId }),
      );

    if (memberBalance.isLessThan(amountFromBalance.value)) {
      return err(new ApplicationError('El saldo disponible no es suficiente'));
    }

    return ok();
  }
}
