import SimpleSchema from 'simpl-schema';

import { SchemaBuilder } from '@adapters/mongo/schemas/schema-builder';
import { UniqueIDSchema } from '@adapters/mongo/schemas/unique-id.schema';

export const EntitySchema = new SimpleSchema({
  createdAt: Date,
  createdBy: String,
  deletedAt: SchemaBuilder.c().date().optional().b(),
  deletedBy: SchemaBuilder.c().string().optional().b(),
  isDeleted: Boolean,
  updatedAt: SchemaBuilder.c().date().autoValue(new Date()).b(),
  updatedBy: String,
}).extend(UniqueIDSchema);
