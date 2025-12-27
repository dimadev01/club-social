import type { ICreatePaymentDueDto } from '../payment-due';

import { DueCategory } from '../dues';
import { UserStatus } from '../users';
import { PaymentStatus } from './payment.enum';

export interface ICreatePaymentDto {
  date: string;
  memberId: string;
  notes: null | string;
  paymentDues: ICreatePaymentDueDto[];
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

export interface IPaymentPaginatedExtraDto {
  totalAmount: number;
}

export interface IPaymentStatisticsByCategoryItemDto {
  amount: number;
  average: number;
  count: number;
}

export interface IPaymentStatisticsDto {
  average: number;
  categories: Record<DueCategory, IPaymentStatisticsByCategoryItemDto>;
  paymentDuesCount: number;
  paymentsCount: number;
  totalAmount: number;
}

export interface IPaymentStatisticsQueryDto {
  dateRange?: [string, string];
}

export interface IVoidPaymentDto {
  voidReason: string;
}
