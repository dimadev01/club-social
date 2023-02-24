import { CategoryEnum } from '@domain/categories/categories.enum';

export class GetMovementResponseDto {
  _id: string;

  date: string;

  amount: number;

  amountFormatted: string;

  category: CategoryEnum;

  notes: string | null;
}
