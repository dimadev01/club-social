import {
  MemberLedgerEntryMovementType,
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';
import { Inject, Injectable } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { MemberLedgerEntryEntity } from '@/members/ledger/domain/member-ledger-entry.entity';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, ResultUtils } from '@/shared/domain/result';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  MEMBER_LEDGER_REPOSITORY_PROVIDER,
  type MemberLedgerRepository,
} from '../member-ledger.repository';

export interface CreateMemberLedgerEntryParams {
  amount: number;
  createdBy: string;
  date: string;
  memberId: string;
  movementType: MemberLedgerEntryMovementType;
  notes: null | string;
}

@Injectable()
export class CreateMemberLedgerEntryUseCase extends UseCase<MemberLedgerEntryEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(MEMBER_LEDGER_REPOSITORY_PROVIDER)
    private readonly memberLedgerRepository: MemberLedgerRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(
    params: CreateMemberLedgerEntryParams,
  ): Promise<Result<MemberLedgerEntryEntity>> {
    this.logger.info({
      message: 'Creating member ledger entry',
      params,
    });

    const results = ResultUtils.combine([
      SignedAmount.fromCents(params.amount),
      DateOnly.fromString(params.date),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [amount, date] = results.value;

    const memberId = UniqueId.raw({ value: params.memberId });

    const isInflow =
      params.movementType === MemberLedgerEntryMovementType.INFLOW;

    const ledgerEntryType = isInflow
      ? MemberLedgerEntryType.ADJUSTMENT_CREDIT
      : MemberLedgerEntryType.ADJUSTMENT_DEBIT;

    const ledgerEntryAmount = isInflow ? amount : amount.toNegative();

    const ledgerEntry = MemberLedgerEntryEntity.create(
      {
        amount: ledgerEntryAmount,
        date,
        memberId,
        notes: params.notes,
        paymentId: null,
        reversalOfId: null,
        source: MemberLedgerEntrySource.ADJUSTMENT,
        status: MemberLedgerEntryStatus.POSTED,
        type: ledgerEntryType,
      },
      params.createdBy,
    );

    if (ledgerEntry.isErr()) {
      return err(ledgerEntry.error);
    }

    await this.memberLedgerRepository.save(ledgerEntry.value);

    this.eventPublisher.dispatch(ledgerEntry.value);

    return ok(ledgerEntry.value);
  }
}
