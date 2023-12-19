import { DueCategoryEnum } from '@domain/dues/due.enum';

export class PendingDueDto {
  public _id: string;

  public amount: number;

  public category: DueCategoryEnum;

  public date: string;

  public memberId: string;

  public memberName: string;

  public membershipMonth: string;
}
