import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { NotificationEntity } from '@infra/mongo/entities/notification.entity';

@singleton()
export class NotificationMongoCollection extends MongoCollection<NotificationEntity> {
  public constructor() {
    super('notifications');
  }
}
