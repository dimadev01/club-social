import { singleton } from 'tsyringe';

import { MongoCollection } from '@adapters/mongo/collections/mongo.collection';
import { PaymentDueEntity } from '@adapters/mongo/entities/payment-due.entity';

@singleton()
export class PaymentDueCollection extends MongoCollection<PaymentDueEntity> {
  public constructor() {
    super('payment.dues');
  }
}
