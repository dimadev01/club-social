import {
  MovementCategory,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';

export interface MovementPaginatedExtraReadModel {
  totalAmount: number;
  totalAmountInflow: number;
  totalAmountOutflow: number;
}

export type MovementPaginatedReadModel = Pick<
  MovementReadModel,
  | 'amount'
  | 'category'
  | 'createdAt'
  | 'date'
  | 'id'
  | 'mode'
  | 'notes'
  | 'payment'
  | 'status'
>;

export interface MovementPaymentReadModel {
  id: string;
  receiptNumber: null | string;
}

export interface MovementReadModel {
  amount: number;
  category: MovementCategory;
  createdAt: Date;
  createdBy: string;
  date: string;
  id: string;
  mode: MovementMode;
  notes: null | string;
  payment: MovementPaymentReadModel | null;
  status: MovementStatus;
  updatedAt: Date;
  updatedBy: null | string;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}
export interface MovementStatisticsModel {
  balance: number;
  cumulativeTotal: number;
  totalInflow: number;
  totalOutflow: number;
}
