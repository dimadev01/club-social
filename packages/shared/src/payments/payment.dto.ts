import type { ICreatePaymentDueItemDto } from '../payment-due';

import { UserStatus } from '../users';
import { PaymentStatus } from './payment.enum';

export interface ICreatePaymentDto {
  date: string;
  memberId: string;
  notes: null | string;
  paymentDues: ICreatePaymentDueItemDto[];
  receiptNumber: null | string;
}

export interface IPaymentDetailDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  memberId: string;
  memberName: string;
  notes: null | string;
  receiptNumber: null | string;
  status: PaymentStatus;
  updatedAt: string;
  updatedBy: string;
  userStatus: UserStatus;
  voidedAt: null | string;
  voidedBy: null | string;
  voidReason: null | string;
}

export interface IPaymentPaginatedDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  memberId: string;
  memberName: string;
  status: PaymentStatus;
}

export interface IPaymentPaginatedSummaryDto {
  totalAmount: number;
}

export interface IVoidPaymentDto {
  voidReason: string;
}
