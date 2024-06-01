import { singleton } from 'tsyringe';

import { MongoCollectionNewV } from '@infra/mongo/collections/mongo.collection';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due/payment-due.entity';

@singleton()
export class PaymentDueCollection extends MongoCollectionNewV<PaymentDueEntity> {
  public constructor() {
    super('payment.dues');
  }
}
