import { CategoryEnum } from '@domain/categories/categories.enum';

export class GetPriceResponseDto {
  _id: string;

  amount: number;

  category: CategoryEnum;
}
