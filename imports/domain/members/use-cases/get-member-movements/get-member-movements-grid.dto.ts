import { CategoryEnum, CategoryType } from '@domain/enums/categories.enum';

export class MemberMovementGridDto {
  _id: string;

  date: string;

  amount: string;

  category: CategoryEnum;

  type: CategoryType;
}
