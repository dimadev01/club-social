import {
  MovementCategory,
  MovementMode,
  MovementStatus,
  MovementType,
} from '@club-social/shared/movements';
import { Injectable } from '@nestjs/common';

import { MovementModel } from '@/infrastructure/database/prisma/generated/models';
import { Mapper } from '@/infrastructure/repositories/mapper';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementEntity } from '../domain/entities/movement.entity';

@Injectable()
export class PrismaMovementMapper extends Mapper<
  MovementEntity,
  MovementModel
> {
  public toDomain(model: MovementModel): MovementEntity {
    return MovementEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: model.amount }),
        category: model.category as MovementCategory,
        createdBy: model.createdBy,
        date: DateOnly.raw({ value: model.date }),
        mode: model.mode as MovementMode,
        notes: model.notes,
        paymentId: model.paymentId
          ? UniqueId.raw({ value: model.paymentId })
          : null,
        status: model.status as MovementStatus,
        type: model.type as MovementType,
        voidedAt: model.voidedAt,
        voidedBy: model.voidedBy,
        voidReason: model.voidReason,
      },
      {
        createdAt: model.createdAt,
        createdBy: model.createdBy,
        deletedAt: model.deletedAt,
        deletedBy: model.deletedBy,
        id: UniqueId.raw({ value: model.id }),
        updatedAt: model.updatedAt,
        updatedBy: model.updatedBy,
      },
    );
  }

  public toPersistence(entity: MovementEntity): MovementModel {
    return {
      amount: entity.amount.toCents(),
      category: entity.category,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      date: entity.date.value,
      deletedAt: entity.deletedAt,
      deletedBy: entity.deletedBy,
      id: entity.id.value,
      mode: entity.mode,
      notes: entity.notes,
      paymentId: entity.paymentId?.value ?? null,
      status: entity.status,
      type: entity.type,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
      voidedAt: entity.voidedAt,
      voidedBy: entity.voidedBy,
      voidReason: entity.voidReason,
    };
  }
}
