import SimpleSchema from 'simpl-schema';

import { Category } from '@domain/categories/entities/category.entity';
import { MongoCollectionOld } from '@infra/mongo/common/mongo-collection.old';

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
