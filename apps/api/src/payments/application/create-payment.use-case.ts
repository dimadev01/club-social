import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
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
import {
  NotificationChannel,
  NotificationType,
} from '@club-social/shared/notifications';
import { Inject } from '@nestjs/common';
import { filter, flow, sumBy } from 'es-toolkit/compat';

import type { Result } from '@/shared/domain/result';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import { DueEntity } from '@/dues/domain/entities/due.entity';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
import { MemberLedgerEntryEntity } from '@/members/ledger/domain/entities/member-ledger-entry.entity';
import {
  MEMBER_LEDGER_REPOSITORY_PROVIDER,
  type MemberLedgerRepository,
} from '@/members/ledger/member-ledger.repository';
import { MovementEntity } from '@/movements/domain/entities/movement.entity';
import { NotificationEntity } from '@/notifications/domain/entities/notification.entity';
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
  balanceAmount: null | number;
  cashAmount: null | number;
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
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
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

    /**
     * Validation phase:
     * 1. Fetch dues to validate pending amounts and apply settlements later.
     * 2. If the member wants to use their credit balance, ensure they have enough.
     *    This prevents overselling credit that doesn't exist.
     */
    const dues = await this.dueRepository.findByIds(
      params.dues.map((pd) => UniqueId.raw({ value: pd.dueId })),
    );

    const sufficientBalanceValidation =
      await this.validateSufficientBalance(params);

    if (sufficientBalanceValidation.isErr()) {
      return err(sufficientBalanceValidation.error);
    }

    const results = ResultUtils.combine([
      Amount.fromCents(sumBy(params.dues, (pd) => pd.cashAmount ?? 0)),
      DateOnly.fromString(params.date),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [paymentAmount, paymentDate] = results.value;

    /**
     * Create the payment aggregate.
     * The payment amount is the sum of cash amounts only (not balance usage).
     * This represents actual money received from the member.
     */
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
     * Process each due being paid in this transaction.
     *
     * A due can be settled using two funding sources:
     * - Cash: Actual money the member is paying now (creates DUE_APPLY_DEBIT entry)
     * - Balance: Credit the member has accumulated from previous over payments (creates BALANCE_APPLY_DEBIT entry)
     *
     * For each funding source used, we:
     * 1. Create a debit ledger entry (reduces what the member owes)
     * 2. Apply the settlement to the due (tracks partial/full payments on the due itself)
     *
     * This separation allows accurate reporting of how dues were paid and maintains
     * the member's balance as a distinct, usable credit line.
     */
    const debitLedgerEntries: MemberLedgerEntryEntity[] = [];

    for (const due of dues) {
      const dueFromParams = params.dues.find((d) => d.dueId === due.id.value);
      Guard.defined(dueFromParams);

      const amounts = ResultUtils.combine([
        Amount.fromCents(dueFromParams.cashAmount ?? 0),
        SignedAmount.fromCents(dueFromParams.balanceAmount ?? 0),
      ]);

      if (amounts.isErr()) {
        return err(amounts.error);
      }

      const [cashAmount, balanceAmount] = amounts.value;

      const totalAmount = cashAmount.add(balanceAmount);

      if (totalAmount.isZero()) {
        return err(
          new ApplicationError('El monto total a registrar no puede ser cero'),
        );
      }

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

      if (cashAmount.isPositive()) {
        const cashDebitEntry = MemberLedgerEntryEntity.create(
          {
            amount: cashAmount.toNegative(),
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
          amount: cashAmount,
          createdBy: params.createdBy,
          memberLedgerEntryId: cashDebitEntry.value.id,
          paymentId: payment.value.id,
        });

        if (dueApplySettlementResult.isErr()) {
          return err(dueApplySettlementResult.error);
        }
      }

      // If the due has an amount from balance, use it
      if (balanceAmount.isPositive()) {
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

    const movements: MovementEntity[] = [];
    let creditEntry: MemberLedgerEntryEntity | null = null;

    /**
     * Double-entry accounting for cash payments:
     * When cash is received, we create a DEPOSIT_CREDIT entry representing money coming in.
     * This balances against the DUE_APPLY_DEBIT entries created above.
     *
     * We also create a Movement to track this as actual cash flow into the organization.
     * Movements feed into financial reports and cash reconciliation.
     */
    if (payment.value.amount.isPositive()) {
      const result = MemberLedgerEntryEntity.create(
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

      if (result.isErr()) {
        return err(result.error);
      }

      creditEntry = result.value;

      const creditMovement = MovementEntity.create(
        {
          amount: creditEntry.amount,
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

      movements.push(creditMovement.value);
    }

    /**
     * Surplus handling:
     * When a member pays more than the total dues amount, the extra money becomes
     * credit balance they can use for future payments. This creates a DEPOSIT_CREDIT
     * entry that isn't offset by any debit—it stays as positive balance.
     *
     * Example: Dues total $100, member pays $150. The $50 surplus becomes credit.
     */
    let surplusCreditEntry: MemberLedgerEntryEntity | null = null;

    const surplusAmount = SignedAmount.fromCents(
      params.surplusToCreditAmount ?? 0,
    );

    if (surplusAmount.isErr()) {
      return err(surplusAmount.error);
    }

    if (surplusAmount.value.isPositive()) {
      const surplusCreditEntryResult = MemberLedgerEntryEntity.create(
        {
          amount: surplusAmount.value,
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

    const member =
      await this.memberRepository.findByIdReadModelOrThrow(memberId);

    let notification: NotificationEntity | null = null;

    if (member.notificationPreferences.notifyOnPaymentMade) {
      const pendingDues =
        await this.dueRepository.findPendingByMemberId(memberId);

      const getPendingAmount = flow(
        (pendingDueList: DueEntity[], category: DueCategory) =>
          filter(pendingDueList, (d) => d.category === category),
        (pendingDueList: DueEntity[]) =>
          sumBy(pendingDueList, (d) => d.pendingAmount.cents),
      );

      const pendingElectricity = getPendingAmount(
        pendingDues,
        DueCategory.ELECTRICITY,
      );
      const pendingGuest = getPendingAmount(pendingDues, DueCategory.GUEST);
      const pendingMembership = getPendingAmount(
        pendingDues,
        DueCategory.MEMBERSHIP,
      );
      const pendingTotal =
        pendingElectricity + pendingGuest + pendingMembership;

      const duesDetail = dues.map((due) => {
        const dueFromParams = params.dues.find((d) => d.dueId === due.id.value);
        Guard.defined(dueFromParams);

        const totalPaid =
          (dueFromParams.cashAmount ?? 0) + (dueFromParams.balanceAmount ?? 0);

        return {
          amount: NumberFormat.currencyCents(totalPaid),
          category: due.category,
          date: DateFormat.date(due.date.value),
        };
      });

      let duesDetailHtml = '<ul>';
      duesDetail.forEach((due) => {
        duesDetailHtml += `<li>Pago por movimiento correspondiente al concepto de ${DueCategoryLabel[due.category]} del ${due.date} por un monto de ${due.amount}</li>`;
      });
      duesDetailHtml += '</ul>';

      const notificationResult = NotificationEntity.create(
        {
          channel: NotificationChannel.EMAIL,
          memberId,
          payload: {
            template: 'new-payment',
            variables: {
              amount: NumberFormat.currencyCents(payment.value.amount.cents),
              date: DateFormat.date(paymentDate.value),
              detail: duesDetailHtml,
              memberName: member.firstName,
              pendingElectricity:
                NumberFormat.currencyCents(pendingElectricity),
              pendingGuest: NumberFormat.currencyCents(pendingGuest),
              pendingMembership: NumberFormat.currencyCents(pendingMembership),
              pendingTotal: NumberFormat.currencyCents(pendingTotal),
            },
          },
          recipientAddress: member.email,
          sourceEntity: 'payment',
          sourceEntityId: payment.value.id,
          type: NotificationType.PAYMENT_MADE,
        },
        params.createdBy,
      );

      if (notificationResult.isOk()) {
        notification = notificationResult.value;
      }
    }

    /**
     * Atomic persistence:
     * All entities are saved within a single transaction to ensure consistency.
     * If any save fails, the entire payment is rolled back—we never have partial
     * payments or orphaned ledger entries.
     */
    await this.unitOfWork.execute(
      async ({
        duesRepository,
        memberLedgerRepository,
        movementsRepository,
        notificationRepository,
        paymentsRepository,
      }) => {
        await paymentsRepository.save(payment.value);

        if (creditEntry) {
          await memberLedgerRepository.save(creditEntry);
        }

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

        if (notification) {
          await notificationRepository.save(notification);
        }
      },
    );

    /**
     * Domain events are dispatched after successful persistence.
     * These trigger side effects like audit logging, notifications, or cache invalidation.
     * Events are dispatched outside the transaction—if a handler fails, the payment still succeeds.
     */
    this.eventPublisher.dispatch(payment.value);

    if (creditEntry) {
      this.eventPublisher.dispatch(creditEntry);
    }

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
    const balanceAmountSum = sumBy(params.dues, (d) => d.balanceAmount ?? 0);

    if (balanceAmountSum === 0) {
      return ok();
    }

    const balanceAmount = Amount.fromCents(balanceAmountSum);

    if (balanceAmount.isErr()) {
      return err(balanceAmount.error);
    }

    const memberBalance =
      await this.memberLedgerRepository.getBalanceByMemberId(
        UniqueId.raw({ value: params.memberId }),
      );

    if (memberBalance.isLessThan(balanceAmount.value)) {
      return err(new ApplicationError('El saldo disponible no es suficiente'));
    }

    return ok();
  }
}
