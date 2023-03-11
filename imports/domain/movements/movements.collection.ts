import SimpleSchema from 'simpl-schema';
import { Movement } from '@domain/movements/movement.entity';
import { Collection } from '@infra/database/collection.base';

export const MovementsCollection = new Collection('movements', Movement);

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
    rentalId: { defaultValue: null, optional: true, type: String },
    serviceId: { defaultValue: null, optional: true, type: String },
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

await MovementsCollection.createIndexAsync({ employeeId: 1 });

await MovementsCollection.createIndexAsync({ rentalId: 1 });

await MovementsCollection.createIndexAsync({ professorId: 1 });
