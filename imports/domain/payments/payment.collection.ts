import SimpleSchema from 'simpl-schema';
import { Payment } from '@domain/payments/entities/payment.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { EntitySchema } from '@infra/mongo/schemas/entity.schema';
import { SchemaBuilder } from '@infra/mongo/schemas/schema-builder';

export const PaymentCollection = new MongoCollection('payments', Payment);

export const PaymentSchema = new SimpleSchema({
  date: Date,
  dues: Array,
  'dues.$': SchemaBuilder.c()
    .schema({
      _id: String,
      amount: SimpleSchema.Integer,
      category: String,
      date: Date,
    })
    .b(),
  member: SchemaBuilder.c().schema({ _id: String, name: String }).b(),
  notes: SchemaBuilder.c().string().optional().b(),
  status: String,
}).extend(EntitySchema);

PaymentCollection.attachSchema(PaymentSchema);
