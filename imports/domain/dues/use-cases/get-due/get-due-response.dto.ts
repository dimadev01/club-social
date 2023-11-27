import { DueCategoryEnum } from '@domain/dues/due.enum';

export class GetDueResponseDto {
  public _id: string;

  public amount: number;

  public amountFormatted: string;

  public category: DueCategoryEnum;

  public date: string;

  public memberId: string;

  public notes: string | null;
}
