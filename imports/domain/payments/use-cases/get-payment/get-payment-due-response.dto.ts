import { DueCategoryEnum } from '@domain/dues/due.enum';

export class GetPaymentDueResponseDto {
  public amount: number;

  public membershipMonth: string;

  public dueId: string;

  public dueAmount: number;

  public dueCategory: DueCategoryEnum;

  public dueDate: string;
}
