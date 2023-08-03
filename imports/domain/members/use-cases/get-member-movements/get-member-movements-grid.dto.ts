import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/categories.enum';

export class MemberMovementGridDto {
  _id: string;

  date: string;

  amount: string;

  category: CategoryEnum;

  type: CategoryTypeEnum;
}
