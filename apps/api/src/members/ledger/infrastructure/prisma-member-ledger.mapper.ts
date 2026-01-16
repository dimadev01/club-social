import {
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';
import { Injectable } from '@nestjs/common';

import {
  MemberLedgerEntryCreateInput,
  MemberLedgerEntryModel,
  MemberLedgerEntryUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Guard } from '@/shared/domain/guards';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberLedgerEntryEntity } from '../domain/entities/member-ledger-entry.entity';

@Injectable()
export class PrismaMemberLedgerEntryMapper {
  public toCreateInput(
    memberLedgerEntry: MemberLedgerEntryEntity,
  ): MemberLedgerEntryCreateInput {
    Guard.string(memberLedgerEntry.createdBy);

    return {
      amount: memberLedgerEntry.amount.cents,
      createdBy: memberLedgerEntry.createdBy,
      date: memberLedgerEntry.date?.value ?? '',
      id: memberLedgerEntry.id.value,
      member: { connect: { id: memberLedgerEntry.memberId.value } },
      notes: memberLedgerEntry.notes,
      payment: memberLedgerEntry.paymentId
        ? { connect: { id: memberLedgerEntry.paymentId.value } }
        : undefined,
      reversalOf: memberLedgerEntry.reversalOfId
        ? { connect: { id: memberLedgerEntry.reversalOfId.value } }
        : undefined,
      source: memberLedgerEntry.source,
      status: memberLedgerEntry.status,
      type: memberLedgerEntry.type,
    };
  }

  public toDomain(
    memberLedgerEntry: MemberLedgerEntryModel,
  ): MemberLedgerEntryEntity {
    return MemberLedgerEntryEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: memberLedgerEntry.amount }),
        date: DateOnly.raw({ value: memberLedgerEntry.date }),
        memberId: UniqueId.raw({ value: memberLedgerEntry.memberId }),
        notes: memberLedgerEntry.notes,
        paymentId: memberLedgerEntry.paymentId
          ? UniqueId.raw({ value: memberLedgerEntry.paymentId })
          : null,
        reversalOfId: memberLedgerEntry.reversalOfId
          ? UniqueId.raw({ value: memberLedgerEntry.reversalOfId })
          : null,
        source: memberLedgerEntry.source as MemberLedgerEntrySource,
        status: memberLedgerEntry.status as MemberLedgerEntryStatus,
        type: memberLedgerEntry.type as MemberLedgerEntryType,
      },
      {
        audit: {
          createdAt: memberLedgerEntry.createdAt,
          createdBy: memberLedgerEntry.createdBy,
          updatedAt: memberLedgerEntry.updatedAt,
          updatedBy: memberLedgerEntry.updatedBy,
        },
        id: UniqueId.raw({ value: memberLedgerEntry.id }),
      },
    );
  }

  public toUpdateInput(
    memberLedgerEntry: MemberLedgerEntryEntity,
  ): MemberLedgerEntryUpdateInput {
    return {
      amount: memberLedgerEntry.amount.cents,
      date: memberLedgerEntry.date?.value ?? '',
      id: memberLedgerEntry.id.value,
      notes: memberLedgerEntry.notes,
      source: memberLedgerEntry.source,
      status: memberLedgerEntry.status,
      type: memberLedgerEntry.type,
      updatedBy: memberLedgerEntry.updatedBy,
    };
  }
}
