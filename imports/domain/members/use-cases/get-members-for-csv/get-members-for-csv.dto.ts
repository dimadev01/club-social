import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class MemberForCsvDto {
  public _id: string;

  public category: MemberCategoryEnum;

  public electricityDebt: number;

  public phone: string | null;

  public emails: string[] | null;

  public guestDebt: number;

  public membershipDebt: number;

  public name: string;

  public status: MemberStatusEnum;

  public totalDebt: number;
}
