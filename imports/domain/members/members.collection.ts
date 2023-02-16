import { plainToInstance } from 'class-transformer';
import SimpleSchema from 'simpl-schema';
import { Member } from '@domain/members/member.entity';

export const MembersCollection = new Mongo.Collection<Member>('members', {
  transform: (doc) => plainToInstance(Member, doc),
});

// @ts-ignore
MembersCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    address: { optional: true, type: Object },
    'address.city': { optional: true, type: String },
    'address.state': { optional: true, type: String },
    'address.street': { optional: true, type: String },
    'address.zipCode': { optional: true, type: String },
    category: { optional: true, type: String },
    createdAt: Date,
    dateOfBirth: { optional: true, type: Date },
    documentID: { optional: true, type: String },
    emails: { optional: true, type: Array },
    'emails.$': String,
    fileStatus: { optional: true, type: String },
    maritalStatus: { optional: true, type: String },
    nationality: { optional: true, type: String },
    phones: { optional: true, type: Array },
    'phones.$': String,
    sex: { optional: true, type: String },
    status: { optional: true, type: String },
    updatedAt: Date,
    userId: { optional: true, type: String },
  })
);

await MembersCollection.createIndexAsync({ createdAt: -1 });
