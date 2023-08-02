import { CategoryEnum } from '@domain/enums/categories.enum';

export class GetCategoriesResponseDto {
  _id: string;

  amount: number | null;

  amountFormatted: string | null;

  code: CategoryEnum;

  name: string;
}
