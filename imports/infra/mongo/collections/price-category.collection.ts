import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { PriceCategoryEntity } from '@infra/mongo/entities/price-category.entity';

@singleton()
export class PriceCategoryMongoCollection extends MongoCollection<PriceCategoryEntity> {
  public constructor() {
    super('price.categories');
  }
}
