import { Meteor } from 'meteor/meteor';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class MemberGridDto {
  _id: string;

  name: string;

  emails: Meteor.UserEmail[] | null;

  category: MemberCategoryEnum;

  status: MemberStatusEnum;

  membershipBalance: number;

  guestBalance: number;

  electricityBalance: number;
}
