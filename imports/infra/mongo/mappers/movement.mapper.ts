import { injectable } from 'tsyringe';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Movement } from '@domain/movements/models/movement.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { MovementEntity } from '@infra/mongo/entities/movement.entity';
import { PaymentMapper } from '@infra/mongo/mappers/payment.mapper';

@injectable()
export class MovementMapper extends Mapper<Movement, MovementEntity> {
  public constructor(private readonly _paymentMapper: PaymentMapper) {
    super();
  }

  public toDomain(entity: MovementEntity): Movement {
    return new Movement(
      {
        _id: entity._id,
        amount: new Money({ amount: entity.amount }),
        category: entity.category,
        createdAt: entity.createdAt,
        createdBy: entity.createdBy,
        date: new DateUtcVo(entity.date),
        deletedAt: entity.deletedAt,
        deletedBy: entity.deletedBy,
        employeeId: entity.employeeId,
        isDeleted: entity.isDeleted,
        notes: entity.notes,
        paymentId: entity.paymentId,
        professorId: entity.professorId,
        serviceId: entity.serviceId,
        status: entity.status,
        type: entity.type,
        updatedAt: entity.updatedAt,
        updatedBy: entity.updatedBy,
        voidReason: entity.voidReason,
        voidedAt: entity.voidedAt ? new DateUtcVo(entity.voidedAt) : null,
        voidedBy: entity.voidedBy,
      },
      entity.payment ? this._paymentMapper.toDomain(entity.payment) : undefined,
    );
  }

  protected getEntity(domain: Movement): MovementEntity {
    return new MovementEntity({
      _id: domain._id,
      amount: domain.amount.value,
      category: domain.category,
      createdAt: domain.createdAt,
      createdBy: domain.createdBy,
      date: domain.date.toDate(),
      deletedAt: domain.deletedAt,
      deletedBy: domain.deletedBy,
      employeeId: domain.employeeId,
      isDeleted: domain.isDeleted,
      notes: domain.notes,
      paymentId: domain.paymentId,
      professorId: domain.professorId,
      serviceId: domain.serviceId,
      status: domain.status,
      type: domain.type,
      updatedAt: domain.updatedAt,
      updatedBy: domain.updatedBy,
      voidReason: domain.voidReason,
      voidedAt: domain.voidedAt?.toDate() ?? null,
      voidedBy: domain.voidedBy,
    });
  }
}
