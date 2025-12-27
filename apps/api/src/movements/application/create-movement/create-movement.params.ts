import { MovementCategory, MovementType } from '@club-social/shared/movements';

export interface CreateMovementParams {
  amount: number;
  category: MovementCategory;
  createdBy: string;
  date: string;
  notes: null | string;
  type: MovementType;
}
