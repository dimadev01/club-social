import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { PriceEntity } from '@infra/mongo/entities/price.entity';

@singleton()
export class PriceMongoCollection extends MongoCollection<PriceEntity> {
  public constructor() {
    super('prices');
  }
}
