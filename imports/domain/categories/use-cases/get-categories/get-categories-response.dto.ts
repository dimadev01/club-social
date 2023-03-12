import { CategoryEnum } from '@domain/categories/categories.enum';

export class GetCategoriesResponseDto {
  _id: string;

  amount: number | null;

  amountFormatted: string | null;

  code: CategoryEnum;

  name: string;
}
