import SimpleSchema from 'simpl-schema';

import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { EntitySchema } from '@adapters/mongo/schemas/entity.schema';
import { SchemaBuilder } from '@adapters/mongo/schemas/schema-builder';
import { PaymentOld } from '@domain/payments/entities/payment.entity';

export const PaymentCollectionOld = new MongoCollectionOld(
  'payments.old',
  PaymentOld,
);

export const PaymentSchema = new SimpleSchema({
  date: Date,
  memberId: String,
  notes: SchemaBuilder.c().string().optional().b(),
  receiptNumber: SchemaBuilder.c().string().optional().b(),
  status: String,
}).extend(EntitySchema);

PaymentCollectionOld.attachSchema(PaymentSchema);
