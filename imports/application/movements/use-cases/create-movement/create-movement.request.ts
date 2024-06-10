import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export interface CreateMovementRequest {
  amount: number;
  category: MovementCategoryEnum;
  date: string;
  notes: string | null;
  type: MovementTypeEnum;
}
