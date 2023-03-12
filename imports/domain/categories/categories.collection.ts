import SimpleSchema from 'simpl-schema';
import { Category } from '@domain/categories/category.entity';
import { Collection } from '@infra/database/collection.base';

export const CategoriesCollection = new Collection('categories', Category);

// @ts-expect-error
CategoriesCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    amount: { defaultValue: null, optional: true, type: SimpleSchema.Integer },
    code: String,
    historical: { defaultValue: null, optional: true, type: Array },
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
