import { IPaymentDueItemDto } from '@club-social/shared/payments';

export interface CreatePaymentParams {
  createdBy: string;
  date: string;
  notes: null | string;
  paymentDues: IPaymentDueItemDto[];
  receiptNumber: null | string;
}
