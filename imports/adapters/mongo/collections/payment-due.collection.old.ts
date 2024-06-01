import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { PaymentDueOld } from '@domain/payment-dues/entities/payment-due.entity';

export const PaymentDueCollectionOld = new MongoCollectionOld(
  'payment.dues.old',
  PaymentDueOld,
);
