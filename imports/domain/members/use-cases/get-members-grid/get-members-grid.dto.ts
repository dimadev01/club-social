import { Meteor } from 'meteor/meteor';

import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class MemberGridDto {
  public _id: string;

  public category: MemberCategoryEnum;

  public electricityBalance: number;

  public emails: Meteor.UserEmail[] | null;

  public guestBalance: number;

  public membershipBalance: number;

  public name: string;

  public status: MemberStatusEnum;

  public totalBalance: number;
}
