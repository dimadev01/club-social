import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { EventEntity } from '@infra/mongo/entities/event.entity';

@singleton()
export class EventMongoCollection extends MongoCollection<EventEntity> {
  public constructor() {
    super('events');
  }
}
