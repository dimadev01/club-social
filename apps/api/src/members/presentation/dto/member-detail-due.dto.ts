import { DueCategory, DueStatus } from '@club-social/shared/dues';

export class MemberDetailDueDto {
  public amount: number;
  public category: DueCategory;
  public date: string;
  public id: string;
  public notes: null | string;
  public status: DueStatus;
}
