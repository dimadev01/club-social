import { Meteor } from 'meteor/meteor';
/* eslint-disable sort-keys-fix/sort-keys-fix */
import SimpleSchema from 'simpl-schema';
import { Member } from '@domain/members/member.entity';
import { Collection } from '@infra/database/collection.base';

export const MembersCollection = new Collection('members', Member);

// @ts-expect-error
MembersCollection.attachSchema(
  new SimpleSchema({
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
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
    userId: String,
  })
);

if (Meteor.isServer) {
  MembersCollection.createIndexAsync({ createdAt: -1 });

  MembersCollection.createIndexAsync({ userId: 1 });

  MembersCollection.createIndexAsync({ category: 1 });

  MembersCollection.createIndexAsync({ fileStatus: 1 });

  MembersCollection.createIndexAsync({ status: 1 });

  MembersCollection.createIndexAsync({
    isDeleted: 1,
    fileStatus: 1,
    status: 1,
    category: 1,
  });
}
