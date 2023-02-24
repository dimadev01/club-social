import { IsEnum } from 'class-validator';
import { CategoryEnum } from '@domain/categories/categories.enum';

export class GetPriceRequestDto {
  @IsEnum(CategoryEnum)
  category: CategoryEnum;
}
