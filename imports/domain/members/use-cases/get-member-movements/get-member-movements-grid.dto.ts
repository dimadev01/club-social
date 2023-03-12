import { CategoryEnum, CategoryType } from '@domain/categories/categories.enum';

export class MemberMovementGridDto {
  _id: string;

  date: string;

  amount: string;

  category: CategoryEnum;

  type: CategoryType;
}
