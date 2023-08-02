import { CategoryEnum } from '@domain/enums/categories.enum';

export class GetCategoriesResponseDto {
  _id: string;

  code: CategoryEnum;

  amount: number | null;

  name: string;
}
