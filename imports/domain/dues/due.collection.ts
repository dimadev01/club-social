import SimpleSchema from 'simpl-schema';

import { Due } from '@domain/dues/entities/due.entity';
import { MongoCollectionOld } from '@infra/mongo/common/mongo-collection.old';
import { EntitySchema } from '@infra/mongo/schemas/entity.schema';
import { SchemaBuilder } from '@infra/mongo/schemas/schema-builder';

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
