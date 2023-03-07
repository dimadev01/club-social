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
    memberId: { optional: true, type: String },
    notes: { optional: true, type: String },
    type: String,
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
  })
);

await MovementsCollection.createIndexAsync({ category: 1 });

await MovementsCollection.createIndexAsync({ date: -1 });

await MovementsCollection.createIndexAsync({ isDeleted: 1 });

// eslint-disable-next-line sort-keys-fix/sort-keys-fix
await MovementsCollection.createIndexAsync({ memberId: 1, category: 1 });
