import {
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';
import { Inject } from '@nestjs/common';

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
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { Guard } from '@/shared/domain/guards';
import { err, ok } from '@/shared/domain/result';
import {
  UNIT_OF_WORK_PROVIDER,
  type UnitOfWork,
} from '@/shared/domain/unit-of-work';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface VoidPaymentParams {
  id: string;
  voidedBy: string;
  voidReason: string;
}

export class VoidPaymentUseCase extends UseCase<PaymentEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PAYMENT_REPOSITORY_PROVIDER)
    private readonly paymentRepository: PaymentRepository,
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
    params: VoidPaymentParams,
  ): Promise<Result<PaymentEntity>> {
    this.logger.info({
      message: 'Voiding payment',
      params,
    });

    const payment = await this.paymentRepository.findByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    const paymentVoidResult = payment.void({
      voidedBy: params.voidedBy,
      voidReason: params.voidReason,
    });

    if (paymentVoidResult.isErr()) {
      return err(paymentVoidResult.error);
    }

    const dues = await this.dueRepository.findByIds(payment.dueIds);
    const ledgerEntryIds = dues.flatMap((due) =>
      due.settlements.map((s) => s.memberLedgerEntryId),
    );

    const ledgerEntries =
      await this.memberLedgerRepository.findByIds(ledgerEntryIds);

    const ledgerEntriesToSave: MemberLedgerEntryEntity[] = [];

    for (const due of dues) {
      const duePaymentVoidResult = due.voidPayment({
        paymentId: payment.id,
        voidedBy: params.voidedBy,
      });

      if (duePaymentVoidResult.isErr()) {
        return err(duePaymentVoidResult.error);
      }

      const dueSettlement = due.getDueSettlementByPaymentId(payment.id);

      /**
       * As we are voiding the payment, we need to reverse the debit ledger entry.
       * So the original amount now is credited to the member's account
       */
      const originalDebitEntry = ledgerEntries.find((entry) =>
        entry.id.equals(dueSettlement.memberLedgerEntryId),
      );
      Guard.defined(originalDebitEntry);
      originalDebitEntry.reverse();

      const reversedEntry = MemberLedgerEntryEntity.create(
        {
          amount: originalDebitEntry.amount.toPositive(),
          date: DateOnly.today(),
          memberId: originalDebitEntry.memberId,
          notes: originalDebitEntry.notes,
          paymentId: originalDebitEntry.paymentId,
          reversalOfId: originalDebitEntry.id,
          source: MemberLedgerEntrySource.PAYMENT,
          status: MemberLedgerEntryStatus.POSTED,
          type: MemberLedgerEntryType.REVERSAL_CREDIT,
        },
        params.voidedBy,
      );

      if (reversedEntry.isErr()) {
        return err(reversedEntry.error);
      }

      ledgerEntriesToSave.push(originalDebitEntry, reversedEntry.value);
    }

    await this.unitOfWork.execute(
      async ({
        duesRepository,
        memberLedgerRepository,
        paymentsRepository,
      }) => {
        await paymentsRepository.save(payment);
        await Promise.all(dues.map((due) => duesRepository.save(due)));
        await Promise.all(
          ledgerEntriesToSave.map((entry) =>
            memberLedgerRepository.save(entry),
          ),
        );
      },
    );

    this.eventPublisher.dispatch(payment);
    ledgerEntriesToSave.forEach((entry) => this.eventPublisher.dispatch(entry));
    dues.forEach((due) => this.eventPublisher.dispatch(due));

    return ok(payment);
  }
}
