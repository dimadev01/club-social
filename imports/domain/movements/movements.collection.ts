/* eslint-disable sort-keys-fix/sort-keys-fix */
import SimpleSchema from 'simpl-schema';
import { Movement } from '@domain/movements/entities/movement.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export const MovementsCollection = new MongoCollection('movements', Movement);

// @ts-expect-error
MovementsCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    amount: SimpleSchema.Integer,
    category: String,
    createdAt: Date,
    createdBy: String,
    date: Date,
    employeeId: { defaultValue: null, optional: true, type: String },
    isDeleted: Boolean,
    memberId: { defaultValue: null, optional: true, type: String },
    notes: { defaultValue: null, optional: true, type: String },
    professorId: { defaultValue: null, optional: true, type: String },
    serviceId: { defaultValue: null, optional: true, type: String },
    type: String,
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
  })
);

// await MovementsCollection.rawCollection().dropIndexes();

await MovementsCollection.createIndexAsync({ category: 1 });

await MovementsCollection.createIndexAsync({ date: -1 });

await MovementsCollection.createIndexAsync({
  isDeleted: 1,
  memberId: 1,
  category: 1,
  professor: 1,
  employeeId: 1,
  rentalId: 1,
  date: -1,
});

await MovementsCollection.createIndexAsync({ type: 1 });

await MovementsCollection.createIndexAsync({ memberId: 1 });

await MovementsCollection.createIndexAsync({ employeeId: 1 });

await MovementsCollection.createIndexAsync({ rentalId: 1 });

await MovementsCollection.createIndexAsync({ professorId: 1 });
