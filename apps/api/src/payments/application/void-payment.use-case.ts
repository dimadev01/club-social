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
import { err, ok, ResultUtils } from '@/shared/domain/result';
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

    const voidResult = payment.void({
      voidedBy: params.voidedBy,
      voidReason: params.voidReason,
    });

    if (voidResult.isErr()) {
      return err(voidResult.error);
    }

    const dues = await this.dueRepository.findByIds(payment.dueIds);

    const memberLedgerEntries = await this.memberLedgerRepository.findByIds(
      dues.flatMap((due) => due.settlements.map((s) => s.memberLedgerEntryId)),
    );

    const memberLedgerEntriesToUpdate: MemberLedgerEntryEntity[] = [];

    const voidPaymentResults = await ResultUtils.combineAsync(
      dues.map(async (due) => {
        const settlement = due.settlements.find(
          (s) => s.paymentId?.value === payment.id.value,
        );
        Guard.defined(settlement);

        const memberLedgerEntryToRevert = memberLedgerEntries.find(
          (entry) => entry.id.value === settlement.memberLedgerEntryId.value,
        );
        Guard.defined(memberLedgerEntryToRevert);

        memberLedgerEntryToRevert.reverse();

        const reversedEntry = MemberLedgerEntryEntity.create(
          {
            amount: memberLedgerEntryToRevert.amount,
            date: DateOnly.today(),
            memberId: memberLedgerEntryToRevert.memberId,
            notes: memberLedgerEntryToRevert.notes,
            paymentId: memberLedgerEntryToRevert.paymentId,
            reversalOfId: memberLedgerEntryToRevert.id,
            source: MemberLedgerEntrySource.PAYMENT,
            status: MemberLedgerEntryStatus.POSTED,
            type: MemberLedgerEntryType.REVERSAL_CREDIT,
          },
          params.voidedBy,
        );

        if (reversedEntry.isErr()) {
          return err(reversedEntry.error);
        }

        memberLedgerEntriesToUpdate.push(memberLedgerEntryToRevert);
        memberLedgerEntriesToUpdate.push(reversedEntry.value);

        return due.voidPayment({
          paymentId: payment.id,
          voidedBy: params.voidedBy,
        });
      }),
    );

    if (voidPaymentResults.isErr()) {
      return err(voidPaymentResults.error);
    }

    await this.paymentRepository.save(payment);
    await Promise.all(dues.map((due) => this.dueRepository.save(due)));
    await Promise.all(
      memberLedgerEntriesToUpdate.map((entry) =>
        this.memberLedgerRepository.save(entry),
      ),
    );

    this.eventPublisher.dispatch(payment);
    memberLedgerEntriesToUpdate.forEach((entry) =>
      this.eventPublisher.dispatch(entry),
    );
    dues.forEach((due) => this.eventPublisher.dispatch(due));

    return ok(payment);
  }
}
