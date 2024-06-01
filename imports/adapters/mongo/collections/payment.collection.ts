import { singleton } from 'tsyringe';

import { MongoCollection } from '@adapters/mongo/collections/mongo.collection';
import { PaymentEntity } from '@adapters/mongo/entities/payment.entity';

@singleton()
export class PaymentCollection extends MongoCollection<PaymentEntity> {
  public constructor() {
    super('payments');
  }
}
