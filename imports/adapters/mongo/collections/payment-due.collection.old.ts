import SimpleSchema from 'simpl-schema';

import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { EntitySchema } from '@adapters/mongo/schemas/entity.schema';
import { PaymentDue } from '@domain/payment-dues/entities/payment-due.entity';

export const PaymentDueCollectionOld = new MongoCollectionOld(
  'payment.dues.old',
  PaymentDue,
);

export const PaymentDueSchema = new SimpleSchema({
  amount: SimpleSchema.Integer,
  dueId: String,
  paymentId: String,
}).extend(EntitySchema);

PaymentDueCollectionOld.attachSchema(PaymentDueSchema);
