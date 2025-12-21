import { PaymentDueStatus } from '../payments';

export interface ICreatePaymentDueItemDto {
  amount: number;
  dueId: string;
}

export interface IPaymentDueDetailDto {
  amount: number;
  dueId: string;
  paymentId: string;
  status: PaymentDueStatus;
}
