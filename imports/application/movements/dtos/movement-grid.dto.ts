import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export interface MovementGridDto {
  amount: number;
  category: MovementCategoryEnum;
  createdAt: string;
  date: string;
  id: string;
  notes: string | null;
  status: MovementStatusEnum;
  type: MovementTypeEnum;
}
