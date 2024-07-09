import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { PriceAuditEntity } from '@infra/mongo/entities/price-audit.entity';

@singleton()
export class PriceAuditableCollection extends MongoCollection<PriceAuditEntity> {
  public constructor() {
    super('price.audits');
  }
}
