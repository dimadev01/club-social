import { Meteor } from 'meteor/meteor';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class MemberGridDto {
  public _id: string;

  public category: MemberCategoryEnum;

  public electricityDebt: number;

  public emails: Meteor.UserEmail[] | null;

  public guestDebt: number;

  public membershipDebt: number;

  public name: string;

  public status: MemberStatusEnum;

  public totalDebt: number;
}
