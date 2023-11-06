import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class MemberForCsvDto {
  public _id: string;

  public category: MemberCategoryEnum;

  public electricityDebt: string;

  public emails: string[] | null;

  public guestDebt: string;

  public membershipDebt: string;

  public name: string;

  public status: MemberStatusEnum;

  public totalDebt: string;
}
