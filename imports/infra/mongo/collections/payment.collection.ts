import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { PaymentEntity } from '@infra/mongo/entities/payment.entity';

@singleton()
export class PaymentCollection extends MongoCollection<PaymentEntity> {
  public constructor() {
    super('payments');
  }
}
