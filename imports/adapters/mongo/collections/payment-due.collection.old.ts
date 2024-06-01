import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { PaymentDue } from '@domain/payment-dues/entities/payment-due.entity';

export const PaymentDueCollectionOld = new MongoCollectionOld(
  'payment.dues.old',
  PaymentDue,
);
