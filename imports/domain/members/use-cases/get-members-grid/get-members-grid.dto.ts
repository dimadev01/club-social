import { Meteor } from 'meteor/meteor';
import {
  MemberCategory,
  MemberFileStatus,
  MemberStatus,
} from '@domain/members/members.enum';

export class MemberGridDto {
  _id: string;

  name: string;

  emails: Meteor.UserEmail[] | null;

  category: MemberCategory | null;

  fileStatus: MemberFileStatus | null;

  status: MemberStatus;

  membershipBalance: number;

  guestBalance: number;

  electricityBalance: number;
}
