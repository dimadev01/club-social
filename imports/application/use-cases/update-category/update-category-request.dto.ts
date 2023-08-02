import { IsEnum, IsInt } from 'class-validator';
import { CategoryEnum } from '@domain/enums/categories.enum';

export class UpdateCategoryRequestDto {
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @IsInt()
  amount: number;
}
