import SimpleSchema from 'simpl-schema';

import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { EntitySchema } from '@adapters/mongo/schemas/entity.schema';
import { SchemaBuilder } from '@adapters/mongo/schemas/schema-builder';
import { Due } from '@domain/dues/entities/due.entity';

export const DueCollection = new MongoCollectionOld('dues', Due);

export const DueSchema = new SimpleSchema({
  amount: SimpleSchema.Integer,
  category: String,
  date: Date,
  memberId: String,
  notes: SchemaBuilder.c().string().optional().b(),
  status: String,
}).extend(EntitySchema);

DueCollection.attachSchema(DueSchema);
