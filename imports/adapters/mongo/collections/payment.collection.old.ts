import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { PaymentOld } from '@domain/payments/entities/payment.entity';

export const PaymentCollectionOld = new MongoCollectionOld(
  'payments.old',
  PaymentOld,
);
