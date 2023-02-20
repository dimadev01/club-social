import SimpleSchema from 'simpl-schema';
import { Member } from '@domain/members/member.entity';
import { Collection } from '@infra/database/collection.base';

export const MembersCollection = new Collection('members', Member);

// @ts-ignore
MembersCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    address: Object,
    'address.cityGovId': { optional: true, type: String },
    'address.cityName': { optional: true, type: String },
    'address.stateGovId': { optional: true, type: String },
    'address.stateName': { optional: true, type: String },
    'address.street': { optional: true, type: String },
    'address.zipCode': { optional: true, type: String },
    category: { optional: true, type: String },
    createdAt: Date,
    dateOfBirth: { optional: true, type: Date },
    documentID: { optional: true, type: String },
    emails: { optional: true, type: Array },
    'emails.$': String,
    'emails.address': String,
    'emails.verified': Boolean,
    fileStatus: { optional: true, type: String },
    firstName: String,
    lastName: String,
    maritalStatus: { optional: true, type: String },
    nationality: { optional: true, type: String },
    phones: { optional: true, type: Array },
    'phones.$': String,
    sex: { optional: true, type: String },
    status: { optional: true, type: String },
    updatedAt: { autoValue: () => new Date(), type: Date },
    // user: { optional: true, type: Object },
    userId: { optional: true, type: String },
  })
);

await MembersCollection.createIndexAsync({ createdAt: -1 });

await MembersCollection.createIndexAsync({ userId: 1 });

await MembersCollection.createIndexAsync({ firstName: 1 });

await MembersCollection.createIndexAsync({ lastName: 1 });

await MembersCollection.createIndexAsync({ category: 1 });

await MembersCollection.createIndexAsync({ fileStatus: 1 });

await MembersCollection.createIndexAsync({ status: 1 });
