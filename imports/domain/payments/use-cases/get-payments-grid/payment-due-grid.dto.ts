import { DueCategoryEnum } from '@domain/dues/due.enum';

export class PaymentDueGridDto {
  dueId: string;

  paymentAmount: string;

  dueAmount: string;

  dueDate: string;

  dueCategory: DueCategoryEnum;

  membershipMonth: string;
}
