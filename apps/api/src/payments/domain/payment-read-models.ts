import { DueCategory, DueSettlementStatus } from '@club-social/shared/dues';
import { PaymentStatus } from '@club-social/shared/payments';

export interface PaymentDailyStatisticsReadModel {
  amount: number;
  count: number;
  date: string;
}

export interface PaymentPaginatedExtraReadModel {
  totalAmount: number;
}

export type PaymentPaginatedReadModel = Pick<
  PaymentReadModel,
  | 'amount'
  | 'createdAt'
  | 'createdBy'
  | 'date'
  | 'id'
  | 'member'
  | 'receiptNumber'
  | 'status'
>;

export interface PaymentReadModel {
  amount: number;
  createdAt: Date;
  createdBy: string;
  date: string;
  dueSettlements: PaymentDueSettlement[];
  id: string;
  member: PaymentMember;
  notes: null | string;
  receiptNumber: null | string;
  status: PaymentStatus;
  updatedAt: Date;
  updatedBy: null | string;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}

export interface PaymentStatisticsReadModel {
  amount: number;
  dueSettlements: PaymentStatisticsDueSettlement[];
}

interface PaymentDueSettlement {
  amount: number;
  due: PaymentDueSettlementDue;
  memberLedgerEntry: PaymentDueSettlementMemberLedgerEntry;
  status: DueSettlementStatus;
}

interface PaymentDueSettlementDue {
  amount: number;
  category: DueCategory;
  date: string;
  id: string;
}

interface PaymentDueSettlementMemberLedgerEntry {
  date: string;
  id: string;
}

interface PaymentMember {
  id: string;
  name: string;
}

interface PaymentStatisticsDueSettlement {
  amount: number;
  due: PaymentStatisticsDueSettlementDue;
}

interface PaymentStatisticsDueSettlementDue {
  category: DueCategory;
  id: string;
}
