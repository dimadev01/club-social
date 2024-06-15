import { FindOneById } from '@application/common/repositories/queryable.repository';
import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export interface UpdateMovementRequest extends FindOneById {
  amount: number;
  category: MovementCategoryEnum;
  date: string;
  notes: string | null;
  type: MovementTypeEnum;
}
