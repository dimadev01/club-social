import { DueCategoryEnum } from '@domain/dues/due.enum';

export interface PaymentDto {
  date: string;
  dues: PaymentDueDto[];
  id: string;
  memberId: string;
  memberName: string;
  notes: string | null;
  receiptNumber: number | null;
}

export interface PaymentDueDto {
  amount: number;
  dueAmount: number;
  dueCategory: DueCategoryEnum;
  dueDate: string;
}
