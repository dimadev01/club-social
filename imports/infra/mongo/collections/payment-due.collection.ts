import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due.entity';

@singleton()
export class PaymentDueCollection extends MongoCollection<PaymentDueEntity> {
  public constructor() {
    super('payment.dues');
  }
}
