import { CategoryTypeEnum } from '@domain/categories/category.enum';

export class GetCategoriesByTypeRequestDto {
  public type: CategoryTypeEnum;
}
