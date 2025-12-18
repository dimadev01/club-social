import { DueCategory, DueStatus } from '@club-social/shared/dues';
import { Injectable } from '@nestjs/common';

import { DueModel } from '@/infrastructure/database/prisma/generated/models';
import { Mapper } from '@/infrastructure/repositories/mapper';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DueEntity } from '../domain/entities/due.entity';

@Injectable()
export class PrismaDueMapper extends Mapper<DueEntity, DueModel> {
  public toDomain(due: DueModel): DueEntity {
    return DueEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: due.amount }),
        category: due.category as DueCategory,
        createdBy: due.createdBy,
        date: DateOnly.raw({ value: due.date }),
        memberId: UniqueId.raw({ value: due.memberId }),
        notes: due.notes,
        status: due.status as DueStatus,
        voidedAt: due.voidedAt,
        voidedBy: due.voidedBy,
        voidReason: due.voidReason,
      },
      {
        createdAt: due.createdAt,
        createdBy: due.createdBy,
        deletedAt: due.deletedAt,
        deletedBy: due.deletedBy,
        id: UniqueId.raw({ value: due.id }),
        updatedAt: due.updatedAt,
        updatedBy: due.updatedBy,
      },
    );
  }

  public toPersistence(due: DueEntity): DueModel {
    return {
      amount: due.amount.toCents(),
      category: due.category,
      createdAt: due.createdAt,
      createdBy: due.createdBy,
      date: due.date.value,
      deletedAt: due.deletedAt,
      deletedBy: due.deletedBy,
      id: due.id.value,
      memberId: due.memberId.value,
      notes: due.notes,
      status: due.status,
      updatedAt: due.updatedAt,
      updatedBy: due.updatedBy,
      voidedAt: due.voidedAt,
      voidedBy: due.voidedBy,
      voidReason: due.voidReason,
    };
  }
}
