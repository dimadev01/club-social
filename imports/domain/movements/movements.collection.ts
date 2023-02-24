import SimpleSchema from 'simpl-schema';
import { Movement } from '@domain/movements/movement.entity';
import { Collection } from '@infra/database/collection.base';

export const MovementsCollection = new Collection('movements', Movement);

// @ts-ignore
MovementsCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    amount: SimpleSchema.Integer,
    category: String,
    createdAt: Date,
    createdBy: String,
    date: Date,
    isDeleted: Boolean,
    member: { optional: true, type: Object },
    'member._id': String,
    'member.firstName': String,
    'member.lastName': String,
    notes: { optional: true, type: String },
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
  })
);

await MovementsCollection.createIndexAsync({ category: 1 });

await MovementsCollection.createIndexAsync({ date: -1 });

await MovementsCollection.createIndexAsync({ isDeleted: 1 });

await MovementsCollection.createIndexAsync({ 'member._id': 1 });

await MovementsCollection.createIndexAsync({ 'member.firstName': 1 });

await MovementsCollection.createIndexAsync({ 'member.lastName': 1 });
