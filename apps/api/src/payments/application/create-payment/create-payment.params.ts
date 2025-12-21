import { ICreatePaymentDueItemDto } from '@club-social/shared/payment-due';

export interface CreatePaymentParams {
  createdBy: string;
  date: string;
  memberId: string;
  notes: null | string;
  paymentDues: ICreatePaymentDueItemDto[];
  receiptNumber: null | string;
}
