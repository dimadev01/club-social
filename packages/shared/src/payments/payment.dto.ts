import { PaymentStatus } from './payment.enum';

export interface ICreatePaymentDto {
  date: string;
  notes: null | string;
  paymentDues: IPaymentDueItemDto[];
}

export interface IPaymentDetailDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  notes: null | string;
  paymentDues: IPaymentDueDetailDto[];
  status: PaymentStatus;
  updatedAt: string;
  updatedBy: null | string;
}

export interface IPaymentDueDetailDto {
  amount: number;
  dueId: string;
  paymentId: string;
}

export interface IPaymentDueItemDto {
  amount: number;
  dueId: string;
}

export interface IPaymentPaginatedDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  paymentDues: IPaymentDueDetailDto[];
  status: PaymentStatus;
}

export interface IUpdatePaymentDto {
  date: string;
  notes: null | string;
  paymentDues: IPaymentDueItemDto[];
}
