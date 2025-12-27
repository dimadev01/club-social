import {
  MovementCategory,
  MovementMode,
  MovementStatus,
  MovementType,
} from './movement.enum';

export interface ICreateMovementDto {
  amount: number;
  category: MovementCategory;
  date: string;
  notes: null | string;
  type: MovementType;
}

export interface IMovementDetailDto {
  amount: number;
  category: MovementCategory;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  mode: MovementMode;
  notes: null | string;
  paymentId: null | string;
  status: MovementStatus;
  type: MovementType;
  updatedAt: string;
  updatedBy: string;
  voidedAt: null | string;
  voidedBy: null | string;
  voidReason: null | string;
}

export interface IMovementPaginatedDto {
  amount: number;
  category: MovementCategory;
  createdAt: string;
  date: string;
  id: string;
  mode: MovementMode;
  notes: null | string;
  paymentId: null | string;
  status: MovementStatus;
  type: MovementType;
}

export interface IMovementPaginatedExtraDto {
  totalAmount: number;
  totalAmountInflow: number;
  totalAmountOutflow: number;
}

export interface IUpdateMovementDto {
  amount?: number;
  notes?: null | string;
}

export interface IVoidMovementDto {
  voidReason: string;
}
