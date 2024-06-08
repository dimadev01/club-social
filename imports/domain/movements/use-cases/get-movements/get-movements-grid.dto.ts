import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export class OldMovementGridDto {
  _id: string;

  date: string;

  amount: string;

  category: MovementCategoryEnum;

  details: string;

  memberId: string | null;

  type: MovementTypeEnum;

  isDeleted: boolean;
}
