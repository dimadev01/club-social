import { singleton } from 'tsyringe';

import { MongoCollectionNewV } from '@infra/mongo/collections/mongo.collection';
import { PaymentAuditEntity } from '@infra/mongo/entities/payment-audit.entity';

@singleton()
export class PaymentAuditableCollection extends MongoCollectionNewV<PaymentAuditEntity> {
  public constructor() {
    super('payment.audits');
  }
}
