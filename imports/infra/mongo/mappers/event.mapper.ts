import { injectable } from 'tsyringe';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { Event } from '@domain/events/models/event.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { EventEntity } from '@infra/mongo/entities/event.entity';

@injectable()
export class EventMapper extends Mapper<Event, EventEntity> {
  public toDomain(entity: EventEntity): Event {
    return new Event({
      _id: entity._id,
      action: entity.action,
      createdAt: new DateTimeVo(entity.createdAt),
      createdBy: entity.createdBy,
      deletedAt: entity.deletedAt ? new DateTimeVo(entity.deletedAt) : null,
      deletedBy: entity.deletedBy,
      description: entity.description,
      isDeleted: entity.isDeleted,
      resource: entity.resource,
      resourceId: entity.resourceId,
      updatedAt: new DateTimeVo(entity.updatedAt),
      updatedBy: entity.updatedBy,
    });
  }

  protected getEntity(domain: Event): EventEntity {
    return new EventEntity({
      _id: domain._id,
      action: domain.action,
      createdAt: domain.createdAt.date,
      createdBy: domain.createdBy,
      deletedAt: domain.deletedAt?.date ?? null,
      deletedBy: domain.deletedBy,
      description: domain.description,
      isDeleted: domain.isDeleted,
      resource: domain.resource,
      resourceId: domain.resourceId,
      updatedAt: domain.updatedAt.date,
      updatedBy: domain.updatedBy,
    });
  }
}
