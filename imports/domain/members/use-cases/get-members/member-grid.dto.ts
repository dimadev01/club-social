import { Meteor } from 'meteor/meteor';

export class MemberGridDto {
  _id: string;

  dateOfBirth: string | null;

  name: string;

  emails: Meteor.UserEmail[] | null;
}
