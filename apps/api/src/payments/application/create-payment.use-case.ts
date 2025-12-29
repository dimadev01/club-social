import {
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';
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
import { PaymentEntity } from '@/payments/domain/entities/payment.entity';
import {
  PAYMENT_REPOSITORY_PROVIDER,
  type PaymentRepository,
} from '@/payments/domain/payment.repository';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { Guard } from '@/shared/domain/guards';
import { err, ok, ResultUtils } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

interface CreatePaymentDueParams {
  amount: number;
  dueId: string;
}

interface CreatePaymentParams {
  createdBy: string;
  date: string;
  dues: CreatePaymentDueParams[];
  memberId: string;
  notes: null | string;
  receiptNumber: null | string;
}

export class CreatePaymentUseCase extends UseCase<PaymentEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PAYMENT_REPOSITORY_PROVIDER)
    private readonly paymentRepository: PaymentRepository,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    @Inject(MEMBER_LEDGER_REPOSITORY_PROVIDER)
    private readonly memberLedgerRepository: MemberLedgerRepository,
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

    /**
     * Validation that ensure the dues exist
     */
    const dues = await this.dueRepository.findByIds(
      params.dues.map((pd) => UniqueId.raw({ value: pd.dueId })),
    );

    if (dues.length !== params.dues.length) {
      return err(new ApplicationError('Una o más cuotas no existen'));
    }

    const results = ResultUtils.combine([
      Amount.fromCents(sumBy(params.dues, (pd) => pd.amount)),
      DateOnly.fromString(params.date),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [paymentAmount, paymentDate] = results.value;

    const payment = PaymentEntity.create(
      {
        amount: paymentAmount,
        date: paymentDate,
        dueIds: dues.map((due) => due.id),
        memberId: UniqueId.raw({ value: params.memberId }),
        notes: params.notes,
        receiptNumber: params.receiptNumber,
      },
      params.createdBy,
    );

    if (payment.isErr()) {
      return err(payment.error);
    }

    const memberLedgerEntries: MemberLedgerEntryEntity[] = [];

    const creditEntry = MemberLedgerEntryEntity.create(
      {
        amount: payment.value.amount,
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

    if (creditEntry.isErr()) {
      return err(creditEntry.error);
    }

    memberLedgerEntries.push(creditEntry.value);

    const dueSettlements = ResultUtils.combine(
      dues.map((due) => {
        const dueInParams = params.dues.find((pd) => pd.dueId === due.id.value);

        Guard.defined(dueInParams);

        const amount = Amount.fromCents(dueInParams.amount);

        if (amount.isErr()) {
          return err(amount.error);
        }

        const debitEntry = MemberLedgerEntryEntity.create(
          {
            amount: amount.value,
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

        if (debitEntry.isErr()) {
          return err(debitEntry.error);
        }

        memberLedgerEntries.push(debitEntry.value);

        return due.applySettlement({
          amount: amount.value,
          createdBy: params.createdBy,
          memberLedgerEntryId: debitEntry.value.id,
          paymentId: payment.value.id,
        });
      }),
    );

    if (dueSettlements.isErr()) {
      return err(dueSettlements.error);
    }

    await this.paymentRepository.save(payment.value);
    await Promise.all(
      memberLedgerEntries.map((entry) =>
        this.memberLedgerRepository.save(entry),
      ),
    );
    await Promise.all(dues.map((due) => this.dueRepository.save(due)));

    this.eventPublisher.dispatch(payment.value);
    dues.forEach((due) => this.eventPublisher.dispatch(due));

    return ok(payment.value);
  }
}
