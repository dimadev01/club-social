import type { ICreatePaymentDueDto } from '../due-settlements';

import { DueCategory } from '../dues';
import { PaymentStatus } from './payment.enum';

export interface ICreatePaymentDto {
  date: string;
  memberId: string;
  notes: null | string;
  paymentDues: ICreatePaymentDueDto[];
  receiptNumber: null | string;
}

export interface IPaymentStatisticsByCategoryItemDto {
  amount: number;
  average: number;
  count: number;
}

export interface IPaymentStatisticsQueryDto {
  dateRange?: [string, string];
}

export interface IVoidPaymentDto {
  voidReason: string;
}

export interface PaymentDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  member: PaymentMemberDto;
  memberId: string;
  memberName: string;
  notes: null | string;
  receiptNumber: null | string;
  status: PaymentStatus;
  updatedAt: string;
  updatedBy?: null | string;
  voidedAt: null | string;
  voidedBy: null | string;
  voidReason: null | string;
}

export interface PaymentMemberDto {
  id: string;
  name: string;
}

export interface PaymentPaginatedDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  memberId: string;
  memberName: string;
  status: PaymentStatus;
}

export interface PaymentPaginatedExtraDto {
  totalAmount: number;
}

export interface PaymentStatistics {
  average: number;
  categories: Record<DueCategory, IPaymentStatisticsByCategoryItemDto>;
  count: number;
  dueSettlementsCount: number;
  total: number;
}
