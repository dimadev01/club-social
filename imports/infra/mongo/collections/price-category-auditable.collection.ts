import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { PriceCategoryAuditEntity } from '@infra/mongo/entities/price-category-audit.entity';

@singleton()
export class PriceCategoryAuditableCollection extends MongoCollection<PriceCategoryAuditEntity> {
  public constructor() {
    super('price.categories.audits');
  }
}
