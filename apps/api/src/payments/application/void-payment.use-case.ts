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

    const voidPaymentResult = payment.void({
      voidedBy: params.voidedBy,
      voidReason: params.voidReason,
    });

    if (voidPaymentResult.isErr()) {
      return err(voidPaymentResult.error);
    }

    const dues = await this.dueRepository.findByIds(payment.dueIds);
    const ledgerEntryIds = dues.flatMap((due) =>
      due.settlements.map((s) => s.memberLedgerEntryId),
    );

    const ledgerEntries =
      await this.memberLedgerRepository.findByIds(ledgerEntryIds);

    const ledgerEntriesToSave: MemberLedgerEntryEntity[] = [];

    for (const due of dues) {
      const settlement = due.settlements.find(
        (s) => s.paymentId?.value === payment.id.value,
      );
      Guard.defined(settlement);

      const originalEntry = ledgerEntries.find(
        (entry) => entry.id.value === settlement.memberLedgerEntryId.value,
      );
      Guard.defined(originalEntry);

      originalEntry.reverse();

      const reversedEntry = MemberLedgerEntryEntity.create(
        {
          amount: originalEntry.amount.toPositive(),
          date: DateOnly.today(),
          memberId: originalEntry.memberId,
          notes: originalEntry.notes,
          paymentId: originalEntry.paymentId,
          reversalOfId: originalEntry.id,
          source: MemberLedgerEntrySource.PAYMENT,
          status: MemberLedgerEntryStatus.POSTED,
          type: MemberLedgerEntryType.REVERSAL_CREDIT,
        },
        params.voidedBy,
      );

      if (reversedEntry.isErr()) {
        return err(reversedEntry.error);
      }

      ledgerEntriesToSave.push(originalEntry, reversedEntry.value);

      const dueVoidPaymentResult = due.voidPayment({
        paymentId: payment.id,
        voidedBy: params.voidedBy,
      });

      if (dueVoidPaymentResult.isErr()) {
        return err(dueVoidPaymentResult.error);
      }
    }

    await this.paymentRepository.save(payment);
    await Promise.all(dues.map((due) => this.dueRepository.save(due)));
    await Promise.all(
      ledgerEntriesToSave.map((entry) =>
        this.memberLedgerRepository.save(entry),
      ),
    );

    this.eventPublisher.dispatch(payment);
    ledgerEntriesToSave.forEach((entry) => this.eventPublisher.dispatch(entry));
    dues.forEach((due) => this.eventPublisher.dispatch(due));

    return ok(payment);
  }
}
