import { DueCategoryEnum } from '@domain/dues/due.enum';

export class PaymentDueGridDto {
  public dueAmount: string;

  public dueCategory: DueCategoryEnum;

  public dueDate: string;

  public dueId: string;

  public membershipMonth: string;

  public paymentAmount: string;
}
