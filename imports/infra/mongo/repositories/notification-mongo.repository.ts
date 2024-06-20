import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { Notification } from '@domain/notifications/models/notification.model';
import { NotificationMongoCollection } from '@infra/mongo/collections/notification.collection';
import { NotificationEntity } from '@infra/mongo/entities/notification.entity';
import { NotificationMapper } from '@infra/mongo/mappers/notification.mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';

@injectable()
export class NotificationMongoRepository extends CrudMongoRepository<
  Notification,
  NotificationEntity
> {
  public constructor(
    @inject(DIToken.ILoggerService)
    protected readonly logger: ILoggerService,
    protected readonly collection: NotificationMongoCollection,
    protected readonly mapper: NotificationMapper,
  ) {
    super(collection, mapper, logger);
  }
}
