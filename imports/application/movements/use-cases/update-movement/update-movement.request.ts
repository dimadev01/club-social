import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { FindOneById } from '@domain/common/repositories/queryable.repository';

export interface UpdateMovementRequest extends FindOneById {
  amount: number;
  category: MovementCategoryEnum;
  date: string;
  notes: string | null;
  type: MovementTypeEnum;
}
