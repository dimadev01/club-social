import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { DueEntity } from '@infra/mongo/entities/due.entity';

@singleton()
export class DueMongoCollection extends MongoCollection<DueEntity> {
  public constructor() {
    super('dues');
  }
}
