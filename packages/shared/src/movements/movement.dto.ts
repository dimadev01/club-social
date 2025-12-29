import {
  MovementCategory,
  MovementMode,
  MovementStatus,
  MovementType,
} from './movement.enum';

export interface CreateMovementDto {
  amount: number;
  category: MovementCategory;
  date: string;
  notes: null | string;
  type: MovementType;
}

export interface MovementDto {
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
  updatedAt: string;
  updatedBy?: null | string;
  voidedAt: null | string;
  voidedBy: null | string;
  voidReason: null | string;
}

export interface MovementPaginatedDto {
  amount: number;
  category: MovementCategory;
  createdAt: string;
  date: string;
  id: string;
  mode: MovementMode;
  notes: null | string;
  paymentId: null | string;
  status: MovementStatus;
}

export interface MovementPaginatedExtraDto {
  totalAmount: number;
  totalAmountInflow: number;
  totalAmountOutflow: number;
}

export interface UpdateMovementDto {
  amount?: number;
  notes?: null | string;
}

export interface VoidMovementDto {
  voidReason: string;
}
