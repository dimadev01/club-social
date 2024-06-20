import { injectable } from 'tsyringe';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { Notification } from '@domain/notifications/models/notification.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { NotificationEntity } from '@infra/mongo/entities/notification.entity';

@injectable()
export class NotificationMapper extends Mapper<
  Notification,
  NotificationEntity
> {
  public toDomain(entity: NotificationEntity): Notification {
    return new Notification({
      _id: entity._id,
      createdAt: new DateTimeVo(entity.createdAt),
      createdBy: entity.createdBy,
      deletedAt: entity.deletedAt ? new DateTimeVo(entity.deletedAt) : null,
      deletedBy: entity.deletedBy,
      isDeleted: entity.isDeleted,
      message: entity.message,
      readAt: entity.readAt ? new DateTimeVo(entity.readAt) : null,
      receiverId: entity.receiverId,
      receiverName: entity.receiverName,
      resource: entity.resource,
      resourceId: entity.resourceId,
      status: entity.status,
      subject: entity.subject,
      updatedAt: new DateTimeVo(entity.updatedAt),
      updatedBy: entity.updatedBy,
    });
  }

  protected getEntity(domain: Notification): NotificationEntity {
    return new NotificationEntity({
      _id: domain._id,
      createdAt: domain.createdAt.date,
      createdBy: domain.createdBy,
      deletedAt: domain.deletedAt?.date ?? null,
      deletedBy: domain.deletedBy,
      isDeleted: domain.isDeleted,
      message: domain.message,
      readAt: domain.readAt?.date ?? null,
      receiverId: domain.receiverId,
      receiverName: domain.receiverName,
      resource: domain.resource,
      resourceId: domain.resourceId,
      status: domain.status,
      subject: domain.subject,
      updatedAt: domain.updatedAt.date,
      updatedBy: domain.updatedBy,
    });
  }
}
