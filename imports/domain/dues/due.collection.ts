import SimpleSchema from 'simpl-schema';
import { Due } from '@domain/dues/entities/due.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { EntitySchema } from '@infra/mongo/schemas/entity.schema';
import { SchemaBuilder } from '@infra/mongo/schemas/schema-builder';

export const DueCollection = new MongoCollection('dues', Due);

export const DueSchema = new SimpleSchema({
  amount: SchemaBuilder.c().integer().b(),
  category: String,
  date: Date,
  member: SchemaBuilder.c().schema({ _id: String }).b(),
  notes: SchemaBuilder.c().string().optional().b(),
}).extend(EntitySchema);

DueCollection.attachSchema(DueSchema);
