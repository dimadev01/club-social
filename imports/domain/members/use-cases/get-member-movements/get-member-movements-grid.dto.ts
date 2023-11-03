import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/category.enum';

export class MemberMovementGridDto {
  _id: string;

  date: string;

  amount: string;

  category: CategoryEnum;

  type: CategoryTypeEnum;
}
