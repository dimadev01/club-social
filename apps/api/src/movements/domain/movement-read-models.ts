import {
  MovementCategory,
  MovementMode,
  MovementStatus,
  MovementType,
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
  | 'paymentId'
  | 'status'
  | 'type'
>;

export interface MovementReadModel {
  amount: number;
  category: MovementCategory;
  createdAt: Date;
  createdBy: string;
  date: string;
  id: string;
  mode: MovementMode;
  notes: null | string;
  paymentId: null | string;
  status: MovementStatus;
  type: MovementType;
  updatedAt: Date;
  updatedBy: null | string;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}
