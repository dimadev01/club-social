import SimpleSchema from 'simpl-schema';
import { Category } from '@domain/categories/entities/category.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export const CategoriesCollection = new MongoCollection('categories', Category);

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

// @ts-expect-error
CategoriesCollection.attachSchema(CategoriesSchema);
