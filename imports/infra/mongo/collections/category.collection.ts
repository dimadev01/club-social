import SimpleSchema from 'simpl-schema';
import { Category } from '@domain/categories/entities/category.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export const CategoryCollection = new MongoCollection('categories', Category);

// @ts-expect-error
CategoryCollection.attachSchema(
  new SimpleSchema({
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
  })
);

await CategoryCollection.createIndexAsync({ name: 1 }, { name: 'c_n' });
