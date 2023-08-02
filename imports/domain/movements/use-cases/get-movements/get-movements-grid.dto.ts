import { CategoryEnum, CategoryTypeEnum } from '@domain/enums/categories.enum';

export class MovementGridDto {
  _id: string;

  date: string;

  amount: string;

  category: CategoryEnum;

  details: string;

  memberId: string | null;

  type: CategoryTypeEnum;

  isDeleted: boolean;
}
