import { DueCategory, DueSettlementStatus } from '../dues';
import { PaymentStatus } from './payment.enum';

export interface CreatePaymentDto {
  date: string;
  dues: CreatePaymentDueDto[];
  memberId: string;
  notes: null | string;
  receiptNumber: null | string;
  surplusToCreditAmount: null | number;
}

export interface CreatePaymentDueDto {
  amount: number;
  amountFromBalance: null | number;
  dueId: string;
}

export interface GetPaymentDailyStatisticsDto {
  month: string; // YYYY-MM format
}

export interface GetPaymentStatisticsDto {
  dateRange?: [string, string];
}

export interface PaymentDailyStatisticsDto {
  days: PaymentDailyStatisticsItemDto[];
}

export interface PaymentDailyStatisticsItemDto {
  amount: number;
  count: number;
  date: string;
}

export interface PaymentDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  member: PaymentMemberDto;
  notes: null | string;
  receiptNumber: null | string;
  settlements: PaymentDueSettlementDto[];
  status: PaymentStatus;
  updatedAt: string;
  updatedBy?: null | string;
  voidedAt: null | string;
  voidedBy: null | string;
  voidReason: null | string;
}

export interface PaymentDueSettlementDto {
  amount: number;
  due: PaymentDueSettlementDueDto;
  memberLedgerEntry: PaymentMemberLedgerEntryDto;
  status: DueSettlementStatus;
}

export interface PaymentDueSettlementDueDto {
  amount: number;
  category: DueCategory;
  date: string;
  id: string;
}

export interface PaymentMemberDto {
  id: string;
  name: string;
}

export interface PaymentMemberLedgerEntryDto {
  date: string;
  id: string;
}

export interface PaymentPaginatedDto {
  amount: number;
  categories: DueCategory[];
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  memberId: string;
  memberName: string;
  receiptNumber: null | string;
  status: PaymentStatus;
}

export interface PaymentPaginatedExtraDto {
  totalAmount: number;
}

export interface PaymentStatisticsCategoryDto {
  amount: number;
  average: number;
  count: number;
}

export interface PaymentStatisticsDto {
  average: number;
  categories: Record<DueCategory, PaymentStatisticsCategoryDto>;
  count: number;
  paidDuesCount: number;
  total: number;
}

export interface VoidPaymentDto {
  voidReason: string;
}
