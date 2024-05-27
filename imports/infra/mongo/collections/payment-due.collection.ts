import SimpleSchema from 'simpl-schema';

import { PaymentDue } from '@domain/payment-dues/entities/payment-due.entity';
import { MongoCollectionOld } from '@infra/mongo/common/mongo-collection.old';
import { EntitySchema } from '@infra/mongo/schemas/entity.schema';

export const PaymentDueCollection = new MongoCollectionOld(
  'payment.dues',
  PaymentDue,
);

export const PaymentDueSchema = new SimpleSchema({
  amount: SimpleSchema.Integer,
  dueId: String,
  paymentId: String,
}).extend(EntitySchema);

PaymentDueCollection.attachSchema(PaymentDueSchema);
