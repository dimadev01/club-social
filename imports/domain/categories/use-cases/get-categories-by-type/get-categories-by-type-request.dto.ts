import { CategoryTypeEnum } from '@domain/categories/category.enum';

export class GetCategoriesByTypeRequestDto {
  type: CategoryTypeEnum;
}
