import { CategoryEnum } from '@domain/categories/category.enum';

export class GetCategoriesResponseDto {
  _id: string;

  code: CategoryEnum;

  amount: number | null;

  name: string;
}
