import {
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';
import { ICreatePaymentDueDto } from '@club-social/shared/payment-due';
import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import { MemberLedgerEntryEntity } from '@/members/ledger/domain/member-ledger-entry.entity';
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

interface Params {
  createdBy: string;
  date: string;
  dues: ICreatePaymentDueDto[];
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
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: Params): Promise<Result<PaymentEntity>> {
    this.logger.info({
      message: 'Creating payment',
      params,
    });

    const dues = await this.dueRepository.findByManyIds(
      params.dues.map((pd) => UniqueId.raw({ value: pd.dueId })),
    );

    if (dues.length !== params.dues.length) {
      return err(new ApplicationError('Una o más cuotas no existen'));
    }

    const date = DateOnly.fromString(params.date);

    if (date.isErr()) {
      return err(date.error);
    }

    const payment = PaymentEntity.create(
      {
        amount: dues.reduce((acc, due) => acc.add(due.amount), Amount.ZERO),
        date: date.value,
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

    const dueSettlements = ResultUtils.combine(
      dues.map((due) => {
        const paymentDueForThisDue = params.dues.find(
          (pd) => pd.dueId === due.id.value,
        );

        Guard.defined(paymentDueForThisDue);

        const amount = Amount.fromCents(paymentDueForThisDue.amount);

        if (amount.isErr()) {
          return err(amount.error);
        }

        const memberLedgerEntry = MemberLedgerEntryEntity.create(
          {
            amount: amount.value,
            date: date.value,
            memberId: UniqueId.raw({ value: params.memberId }),
            notes: params.notes,
            paymentId: payment.value.id,
            reversalOfId: null,
            source: MemberLedgerEntrySource.PAYMENT,
            status: MemberLedgerEntryStatus.POSTED,
            type: MemberLedgerEntryType.PAYMENT_CREDIT,
          },
          params.createdBy,
        );

        if (memberLedgerEntry.isErr()) {
          return err(memberLedgerEntry.error);
        }

        return due.applySettlement({
          amount: amount.value,
          createdBy: params.createdBy,
          memberLedgerEntryId: memberLedgerEntry.value.id,
          paymentId: payment.value.id,
        });
      }),
    );

    if (dueSettlements.isErr()) {
      return err(dueSettlements.error);
    }

    await this.paymentRepository.save(payment.value);
    await Promise.all(dues.map((due) => this.dueRepository.save(due)));

    this.eventPublisher.dispatch(payment.value);
    dues.forEach((due) => this.eventPublisher.dispatch(due));

    return ok(payment.value);
  }
}
