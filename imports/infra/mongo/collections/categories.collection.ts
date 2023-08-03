import SimpleSchema from 'simpl-schema';
import { Category } from '@domain/categories/category.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export const CategoriesCollection = new MongoCollection('categories', Category);

// @ts-expect-error
CategoriesCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    amount: { defaultValue: null, optional: true, type: SimpleSchema.Integer },
    code: String,
    deletedAt: { defaultValue: null, optional: true, type: Date },
    deletedBy: { defaultValue: null, optional: true, type: String },
    historical: { defaultValue: null, optional: true, type: Array },
    'historical.$': Object,
    'historical.$.amount': SimpleSchema.Integer,
    'historical.$.date': Date,
    isDeleted: Boolean,
    name: String,
    type: String,
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
  })
);
