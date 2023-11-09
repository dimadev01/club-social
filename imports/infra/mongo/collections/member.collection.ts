/* eslint-disable sort-keys-fix/sort-keys-fix */
import SimpleSchema from 'simpl-schema';
import { Member } from '@domain/members/entities/member.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export const MemberCollection = new MongoCollection('members', Member);

export const MemberSchema = new SimpleSchema({
  _id: String,
  address: Object,
  'address.cityGovId': { defaultValue: null, optional: true, type: String },
  'address.cityName': { defaultValue: null, optional: true, type: String },
  'address.stateGovId': { defaultValue: null, optional: true, type: String },
  'address.stateName': { defaultValue: null, optional: true, type: String },
  'address.street': { defaultValue: null, optional: true, type: String },
  'address.zipCode': { defaultValue: null, optional: true, type: String },
  category: { defaultValue: null, optional: true, type: String },
  createdAt: Date,
  createdBy: String,
  dateOfBirth: { defaultValue: null, optional: true, type: Date },
  documentID: { defaultValue: null, optional: true, type: String },
  fileStatus: { defaultValue: null, optional: true, type: String },
  isDeleted: Boolean,
  maritalStatus: { defaultValue: null, optional: true, type: String },
  nationality: { defaultValue: null, optional: true, type: String },
  phones: { defaultValue: null, optional: true, type: Array },
  'phones.$': String,
  sex: { defaultValue: null, optional: true, type: String },
  status: { defaultValue: null, optional: true, type: String },
  deletedAt: { defaultValue: null, type: Date, optional: true },
  deletedBy: { defaultValue: null, type: String, optional: true },
  updatedAt: { autoValue: () => new Date(), type: Date },
  updatedBy: String,
  userId: String,
});

// @ts-expect-error
MemberCollection.attachSchema(MemberSchema);
