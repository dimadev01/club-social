import SimpleSchema from 'simpl-schema';

import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { Category } from '@domain/categories/entities/category.entity';

export const CategoryCollection = new MongoCollectionOld(
  'categories',
  Category,
);

export const CategoriesSchema = new SimpleSchema({
  _id: String,
  amount: { defaultValue: null, optional: true, type: SimpleSchema.Integer },
  code: String,
  deletedAt: { defaultValue: null, optional: true, type: Date },
  deletedBy: { defaultValue: null, optional: true, type: String },
  isDeleted: Boolean,
  name: String,
  type: String,
  updatedAt: { autoValue: () => new Date(), type: Date },
  updatedBy: String,
});

CategoryCollection.attachSchema(CategoriesSchema);
