import { PaymentStatus } from './payment.enum';

export interface ICreatePaymentDto {
  amount: number;
  date: string;
  dueId: string;
  notes: null | string;
}

export interface IPaymentDetailDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  dueId: string;
  id: string;
  notes: null | string;
  status: PaymentStatus;
  updatedAt: string;
  updatedBy: null | string;
}

export interface IPaymentPaginatedDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  dueId: string;
  id: string;
  status: PaymentStatus;
}

export interface IUpdatePaymentDto {
  amount: number;
  date: string;
  notes: null | string;
}
