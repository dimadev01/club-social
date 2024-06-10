import { injectable } from 'tsyringe';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Movement } from '@domain/movements/models/movement.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { MovementEntity } from '@infra/mongo/entities/movement.entity';

@injectable()
export class MovementMapper extends Mapper<Movement, MovementEntity> {
  public toDomain(movement: MovementEntity): Movement {
    return new Movement({
      _id: movement._id,
      amount: new Money({ amount: movement.amount }),
      category: movement.category,
      createdAt: movement.createdAt,
      createdBy: movement.createdBy,
      date: new DateUtcVo(movement.date),
      deletedAt: movement.deletedAt,
      deletedBy: movement.deletedBy,
      employeeId: movement.employeeId,
      isDeleted: movement.isDeleted,
      notes: movement.notes,
      paymentId: movement.paymentId,
      professorId: movement.professorId,
      serviceId: movement.serviceId,
      status: movement.status,
      type: movement.type,
      updatedAt: movement.updatedAt,
      updatedBy: movement.updatedBy,
      voidReason: movement.voidReason,
      voidedAt: movement.voidedAt ? new DateUtcVo(movement.voidedAt) : null,
      voidedBy: movement.voidedBy,
    });
  }

  protected getEntity(movement: Movement): MovementEntity {
    return new MovementEntity({
      _id: movement._id,
      amount: movement.amount.value,
      category: movement.category,
      createdAt: movement.createdAt,
      createdBy: movement.createdBy,
      date: movement.date.toDate(),
      deletedAt: movement.deletedAt,
      deletedBy: movement.deletedBy,
      employeeId: movement.employeeId,
      isDeleted: movement.isDeleted,
      notes: movement.notes,
      paymentId: movement.paymentId,
      professorId: movement.professorId,
      serviceId: movement.serviceId,
      status: movement.status,
      type: movement.type,
      updatedAt: movement.updatedAt,
      updatedBy: movement.updatedBy,
      voidReason: movement.voidReason,
      voidedAt: movement.voidedAt?.toDate() ?? null,
      voidedBy: movement.voidedBy,
    });
  }
}
