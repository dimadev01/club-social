import SimpleSchema from 'simpl-schema';
import { Rental } from '@domain/rentals/rental.entity';
import { Collection } from '@infra/database/collection.base';

export const RentalsCollection = new Collection('rentals', Rental);

// @ts-expect-error
RentalsCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    createdAt: Date,
    createdBy: String,
    description: { optional: true, type: String },
    name: String,
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
  })
);

await RentalsCollection.createIndexAsync({ name: 1 });
