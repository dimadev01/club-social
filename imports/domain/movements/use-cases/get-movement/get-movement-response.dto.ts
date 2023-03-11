import { CategoryEnum, CategoryType } from '@domain/categories/categories.enum';

export class GetMovementResponseDto {
  _id: string;

  date: string;

  amount: number;

  amountFormatted: string;

  category: CategoryEnum;

  notes: string | null;

  type: CategoryType;

  memberId: string | null;
}
