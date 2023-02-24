import { IsEnum, IsInt } from 'class-validator';
import { CategoryEnum } from '@domain/categories/categories.enum';

export class UpdateCategoryRequestDto {
  @IsEnum(CategoryEnum)
  category: string;

  @IsInt()
  amount: number;
}
