import SimpleSchema from 'simpl-schema';
import { Category } from '@domain/categories/category.entity';
import { Collection } from '@infra/database/collection.base';

export const CategoriesCollection = new Collection('categories', Category);

// @ts-ignore
CategoriesCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    amount: { optional: true, type: SimpleSchema.Integer },
    code: String,
    historical: { optional: true, type: Array },
    'historical.$': Object,
    'historical.$.amount': SimpleSchema.Integer,
    'historical.$.date': Date,
    name: String,
    type: String,
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
  })
);

await CategoriesCollection.createIndexAsync({ code: 1 });
