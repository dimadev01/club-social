import { DueCategory, DueStatus } from '../dues';
import { PaymentStatus } from '../payments';
import { PaymentDueStatus } from './payment-due.enum';

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

export interface IPaymentDueDetailWithDueDto {
  amount: number;
  dueAmount: number;
  dueCategory: DueCategory;
  dueDate: string;
  dueId: string;
  dueStatus: DueStatus;
  paymentId: string;
  status: PaymentDueStatus;
}

export interface IPaymentDueDetailWithPaymentDto {
  amount: number;
  dueId: string;
  paymentAmount: number;
  paymentDate: string;
  paymentId: string;
  paymentReceiptNumber: null | string;
  paymentStatus: PaymentStatus;
  status: PaymentDueStatus;
}
