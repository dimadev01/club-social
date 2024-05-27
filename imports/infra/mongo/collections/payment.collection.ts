import SimpleSchema from 'simpl-schema';

import { Payment } from '@domain/payments/entities/payment.entity';
import { MongoCollectionOld } from '@infra/mongo/common/mongo-collection.old';
import { EntitySchema } from '@infra/mongo/schemas/entity.schema';
import { SchemaBuilder } from '@infra/mongo/schemas/schema-builder';

export const PaymentCollection = new MongoCollectionOld('payments', Payment);

export const PaymentSchema = new SimpleSchema({
  date: Date,
  memberId: String,
  notes: SchemaBuilder.c().string().optional().b(),
  receiptNumber: SchemaBuilder.c().string().optional().b(),
  status: String,
}).extend(EntitySchema);

PaymentCollection.attachSchema(PaymentSchema);
