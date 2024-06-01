import { DueCategoryEnum } from '@domain/dues/due.enum';

export interface PaymentGridModelDto {
  _id: string;
  date: string;
  dues: PaymentDueGridModelDto[];
  isDeleted: boolean;
  memberId: string;
  memberName: string;
  paymentDuesCount: number;
  receiptNumber: number | null;
  totalAmount: number;
}

export interface PaymentDueGridModelDto {
  _id: string;
  amount: number;
  dueAmount: number;
  dueCategory: DueCategoryEnum;
  dueDate: string;
}
