import {
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';
import { Injectable } from '@nestjs/common';

import { MemberLedgerEntryModel } from '@/infrastructure/database/prisma/generated/models';
import { Mapper } from '@/infrastructure/repositories/mapper';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberLedgerEntryEntity } from '../ledger/domain/member-ledger-entry.entity';

@Injectable()
export class PrismaMemberLedgerEntryMapper extends Mapper<
  MemberLedgerEntryEntity,
  MemberLedgerEntryModel
> {
  public toDomain(
    memberLedgerEntry: MemberLedgerEntryModel,
  ): MemberLedgerEntryEntity {
    return MemberLedgerEntryEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: memberLedgerEntry.amount }),
        createdBy: memberLedgerEntry.createdBy,
        date: DateOnly.raw({ value: memberLedgerEntry.date }),
        memberId: UniqueId.raw({ value: memberLedgerEntry.memberId }),
        notes: memberLedgerEntry.notes,
        paymentId: memberLedgerEntry.paymentId
          ? UniqueId.raw({ value: memberLedgerEntry.paymentId })
          : null,
        reversalOfId: memberLedgerEntry.reversalOfId
          ? UniqueId.raw({ value: memberLedgerEntry.reversalOfId })
          : null,
        status: memberLedgerEntry.status as MemberLedgerEntryStatus,
        type: memberLedgerEntry.type as MemberLedgerEntryType,
      },
      {
        createdAt: memberLedgerEntry.createdAt,
        createdBy: memberLedgerEntry.createdBy,
        deletedAt: null,
        deletedBy: null,
        id: UniqueId.raw({ value: memberLedgerEntry.id }),
        updatedAt: memberLedgerEntry.updatedAt,
        updatedBy: memberLedgerEntry.updatedBy,
      },
    );
  }

  public toPersistence(
    memberLedgerEntry: MemberLedgerEntryEntity,
  ): MemberLedgerEntryModel {
    return {
      amount: memberLedgerEntry.amount.toCents(),
      createdAt: memberLedgerEntry.createdAt,
      createdBy: memberLedgerEntry.createdBy,
      date: memberLedgerEntry.date?.value ?? null,
      id: memberLedgerEntry.id.value,
      memberId: memberLedgerEntry.memberId.value,
      notes: memberLedgerEntry.notes,
      paymentId: memberLedgerEntry.paymentId?.value ?? null,
      reversalOfId: memberLedgerEntry.reversalOfId?.value ?? null,
      status: memberLedgerEntry.status,
      type: memberLedgerEntry.type,
      updatedAt: memberLedgerEntry.updatedAt,
      updatedBy: memberLedgerEntry.updatedBy,
    };
  }
}
