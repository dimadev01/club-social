/* eslint-disable sort-keys-fix/sort-keys-fix */
import SimpleSchema from 'simpl-schema';

import { OldMovement } from '@domain/movements/entities/movement.entity';
import { MongoCollectionOld } from '@infra/mongo/old/mongo-collection.old';

export const OldMovementCollection = new MongoCollectionOld(
  'movements',
  OldMovement,
);

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

OldMovementCollection.attachSchema(MovementSchema);
