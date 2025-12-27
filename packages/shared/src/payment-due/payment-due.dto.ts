import { DueCategory, DueSettlementStatus, DueStatus } from '../dues';
import { PaymentStatus } from '../payments';

export interface ICreatePaymentDueDto {
  amount: number;
  dueId: string;
}

export interface IPaymentDueDetailDto {
  amount: number;
  dueId: string;
  paymentId: string;
  status: DueSettlementStatus;
}

export interface IPaymentDueDetailWithDueDto {
  amount: number;
  dueAmount: number;
  dueCategory: DueCategory;
  dueDate: string;
  dueId: string;
  dueStatus: DueStatus;
  paymentId: null | string;
  status: DueSettlementStatus;
}

export interface IPaymentDueDetailWithPaymentDto {
  amount: number;
  dueId: string;
  paymentAmount: number;
  paymentDate: string;
  paymentId: null | string;
  paymentReceiptNumber: null | string;
  paymentStatus: PaymentStatus;
  status: DueSettlementStatus;
}
