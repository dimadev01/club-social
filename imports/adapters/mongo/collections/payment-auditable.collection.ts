import { singleton } from 'tsyringe';

import { MongoCollection } from '@adapters/mongo/collections/mongo.collection';
import { PaymentAuditEntity } from '@adapters/mongo/entities/payment-audit.entity';

@singleton()
export class PaymentAuditableCollection extends MongoCollection<PaymentAuditEntity> {
  public constructor() {
    super('payment.audits');
  }
}
