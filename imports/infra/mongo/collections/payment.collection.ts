import { singleton } from 'tsyringe';

import { MongoCollectionNewV } from '@infra/mongo/collections/mongo.collection';
import { PaymentEntity } from '@infra/mongo/entities/payment.entity';

@singleton()
export class PaymentCollection extends MongoCollectionNewV<PaymentEntity> {
  public constructor() {
    super('payments');
  }
}
