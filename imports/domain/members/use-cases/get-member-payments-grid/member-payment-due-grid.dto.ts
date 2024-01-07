import { DueCategoryEnum } from '@domain/dues/due.enum';

export class MemberPaymentDueGridDto {
  dueId: string;

  paymentAmount: string;

  dueAmount: string;

  dueDate: string;

  dueCategory: DueCategoryEnum;

  membershipMonth: string;
}
