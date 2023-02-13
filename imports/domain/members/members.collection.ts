import SimpleSchema from 'simpl-schema';
import { Member } from '@domain/members/member.entity';

export const MembersCollection = new Mongo.Collection<Member>('members');

// @ts-ignore
MembersCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    createdAt: Date,
    dateOfBirth: Date,
    updatedAt: Date,
  })
);
