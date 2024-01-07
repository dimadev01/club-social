/* eslint-disable sort-keys-fix/sort-keys-fix */
import SimpleSchema from 'simpl-schema';
import { Movement } from '@domain/movements/entities/movement.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export const MovementCollection = new MongoCollection('movements', Movement);

export const MovementSchema = new SimpleSchema({
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
  deletedAt: { defaultValue: null, type: Date, optional: true },
  deletedBy: { defaultValue: null, type: String, optional: true },
  updatedAt: { autoValue: () => new Date(), type: Date },
  isMigrated: { defaultValue: null, type: Boolean, optional: true },
  paymentId: { defaultValue: null, type: String, optional: true },
  updatedBy: String,
});

MovementCollection.attachSchema(MovementSchema);

await MovementCollection.createIndexAsync({ category: 1 });

await MovementCollection.createIndexAsync({ date: -1 });

await MovementCollection.createIndexAsync({
  isDeleted: 1,
  memberId: 1,
  category: 1,
  professor: 1,
  employeeId: 1,
  date: -1,
});

await MovementCollection.createIndexAsync({ type: 1 });

await MovementCollection.createIndexAsync({ memberId: 1 });

await MovementCollection.createIndexAsync({ employeeId: 1 });

await MovementCollection.createIndexAsync({ professorId: 1 });
