import { DueCategory, DueStatus } from '@club-social/shared/dues';
import { Injectable } from '@nestjs/common';

import {
  DueCreateInput,
  DueModel,
  DueUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Guard } from '@/shared/domain/guards';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DueEntity } from '../domain/entities/due.entity';

@Injectable()
export class PrismaDueMapper {
  public toCreateInput(due: DueEntity): DueCreateInput {
    Guard.string(due.createdBy);

    return {
      amount: due.amount.toCents(),
      category: due.category,
      createdBy: due.createdBy,
      date: due.date.value,
      id: due.id.value,
      member: { connect: { id: due.memberId.value } },
      notes: due.notes,
      status: due.status,
      voidedAt: due.voidedAt,
      voidedBy: due.voidedBy,
      voidReason: due.voidReason,
    };
  }

  public toDomain(due: DueModel): DueEntity {
    return DueEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: due.amount }),
        category: due.category as DueCategory,
        date: DateOnly.raw({ value: due.date }),
        memberId: UniqueId.raw({ value: due.memberId }),
        notes: due.notes,
        settlements: [],
        status: due.status as DueStatus,
        voidedAt: due.voidedAt,
        voidedBy: due.voidedBy,
        voidReason: due.voidReason,
      },
      {
        audit: {
          createdAt: due.createdAt,
          createdBy: due.createdBy,
          updatedAt: due.updatedAt,
          updatedBy: due.updatedBy,
        },
        id: UniqueId.raw({ value: due.id }),
      },
    );
  }

  public toUpdateInput(due: DueEntity): DueUpdateInput {
    return {
      amount: due.amount.toCents(),
      category: due.category,
      date: due.date.value,
      id: due.id.value,
      notes: due.notes,
      status: due.status,
      updatedBy: due.updatedBy,
      voidedAt: due.voidedAt,
      voidedBy: due.voidedBy,
      voidReason: due.voidReason,
    };
  }
}
