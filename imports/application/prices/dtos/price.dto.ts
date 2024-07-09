import { PriceCategoryDto } from '@application/prices/dtos/price-category.dto';
import { DueCategoryEnum } from '@domain/dues/due.enum';

export interface PriceDto {
  amount: number;
  categories: PriceCategoryDto[];
  dueCategory: DueCategoryEnum;
  id: string;
  updatedAt: string;
  updatedBy: string;
}
