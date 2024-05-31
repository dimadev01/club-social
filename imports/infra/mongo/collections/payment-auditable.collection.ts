import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/collections/mongo.collection';
import { PaymentAuditEntity } from '@infra/mongo/entities/payments/payment-audit.entity';

@singleton()
export class PaymentAuditableCollection extends MongoCollection<PaymentAuditEntity> {
  public constructor() {
    super('payment.audits');
  }
}
