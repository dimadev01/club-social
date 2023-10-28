import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/category.enum';

export class GetMovementResponseDto {
  _id: string;

  date: string;

  amount: number;

  amountFormatted: string;

  category: CategoryEnum;

  notes: string | null;

  type: CategoryTypeEnum;

  memberId: string | null;
}
