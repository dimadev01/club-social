import {
  MovementCategory,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';
import { Injectable } from '@nestjs/common';

import {
  MovementCreateInput,
  MovementModel,
  MovementUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Guard } from '@/shared/domain/guards';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementEntity } from '../domain/entities/movement.entity';

@Injectable()
export class PrismaMovementMapper {
  public toCreateInput(entity: MovementEntity): MovementCreateInput {
    Guard.string(entity.createdBy);

    return {
      amount: entity.amount.toCents(),
      category: entity.category,
      createdBy: entity.createdBy,
      date: entity.date.value,
      id: entity.id.value,
      mode: entity.mode,
      notes: entity.notes,
      payment: entity.paymentId
        ? { connect: { id: entity.paymentId.value } }
        : undefined,
      status: entity.status,
      voidedAt: entity.voidedAt,
      voidedBy: entity.voidedBy,
      voidReason: entity.voidReason,
    };
  }

  public toDomain(model: MovementModel): MovementEntity {
    return MovementEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: model.amount }),
        category: model.category as MovementCategory,
        date: DateOnly.raw({ value: model.date }),
        mode: model.mode as MovementMode,
        notes: model.notes,
        paymentId: model.paymentId
          ? UniqueId.raw({ value: model.paymentId })
          : null,
        status: model.status as MovementStatus,
        voidedAt: model.voidedAt,
        voidedBy: model.voidedBy,
        voidReason: model.voidReason,
      },
      {
        audit: {
          createdAt: model.createdAt,
          createdBy: model.createdBy,
          updatedAt: model.updatedAt,
          updatedBy: model.updatedBy,
        },
        id: UniqueId.raw({ value: model.id }),
      },
    );
  }

  public toUpdateInput(entity: MovementEntity): MovementUpdateInput {
    return {
      amount: entity.amount.toCents(),
      category: entity.category,
      date: entity.date.value,
      id: entity.id.value,
      mode: entity.mode,
      notes: entity.notes,
      status: entity.status,
      updatedBy: entity.updatedBy,
      voidedAt: entity.voidedAt,
      voidedBy: entity.voidedBy,
      voidReason: entity.voidReason,
    };
  }
}
