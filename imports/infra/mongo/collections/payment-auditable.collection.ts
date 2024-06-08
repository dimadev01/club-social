import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { PaymentAuditEntity } from '@infra/mongo/entities/payment-audit.entity';

@singleton()
export class PaymentAuditableCollection extends MongoCollection<PaymentAuditEntity> {
  public constructor() {
    super('payment.audits');
  }
}
