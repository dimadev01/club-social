/* eslint-disable sort-keys-fix/sort-keys-fix */

import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { MemberOld } from '@domain/members/models/member.old';

export const MemberCollectionOld = new MongoCollectionOld(
  'members.old',
  MemberOld,
);

// export const MemberSchemaOld = new SimpleSchema({
//   _id: String,
//   address: Object,
//   'address.cityGovId': { defaultValue: null, optional: true, type: String },
//   'address.cityName': { defaultValue: null, optional: true, type: String },
//   'address.stateGovId': { defaultValue: null, optional: true, type: String },
//   'address.stateName': { defaultValue: null, optional: true, type: String },
//   'address.street': { defaultValue: null, optional: true, type: String },
//   'address.zipCode': { defaultValue: null, optional: true, type: String },
//   category: { defaultValue: null, optional: true, type: String },
//   createdAt: Date,
//   createdBy: String,
//   dateOfBirth: { defaultValue: null, optional: true, type: Date },
//   documentID: { defaultValue: null, optional: true, type: String },
//   fileStatus: { defaultValue: null, optional: true, type: String },
//   isDeleted: Boolean,
//   maritalStatus: { defaultValue: null, optional: true, type: String },
//   nationality: { defaultValue: null, optional: true, type: String },
//   phones: { defaultValue: null, optional: true, type: Array },
//   'phones.$': String,
//   sex: { defaultValue: null, optional: true, type: String },
//   status: { defaultValue: null, optional: true, type: String },
//   deletedAt: { defaultValue: null, type: Date, optional: true },
//   deletedBy: { defaultValue: null, type: String, optional: true },
//   updatedAt: { autoValue: () => new Date(), type: Date },
//   updatedBy: String,
//   userId: String,
// });

// MemberCollectionOld.attachSchema(MemberSchemaOld);
