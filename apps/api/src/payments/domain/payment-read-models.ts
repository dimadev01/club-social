import { DueCategory } from '@club-social/shared/dues';
import { PaymentStatus } from '@club-social/shared/payments';

export interface PaymentPaginatedExtraReadModel {
  totalAmount: number;
}

export type PaymentPaginatedReadModel = Pick<
  PaymentReadModel,
  'amount' | 'createdAt' | 'createdBy' | 'date' | 'id' | 'member' | 'status'
>;

export interface PaymentReadModel {
  amount: number;
  createdAt: Date;
  createdBy: string;
  date: string;
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
  settlements: PaymentStatisticsDueSettlement[];
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
}
