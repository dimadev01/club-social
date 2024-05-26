import SimpleSchema from 'simpl-schema';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { EntitySchema } from '@infra/mongo/schemas/entity.schema';
import { PaymentDue } from '../../../domain/payment-dues/entities/payment-due.entity';

export const PaymentDueCollection = new MongoCollection(
  'payment.dues',
  PaymentDue,
);

export const PaymentDueSchema = new SimpleSchema({
  amount: SimpleSchema.Integer,
  dueId: String,
  paymentId: String,
}).extend(EntitySchema);

PaymentDueCollection.attachSchema(PaymentDueSchema);
