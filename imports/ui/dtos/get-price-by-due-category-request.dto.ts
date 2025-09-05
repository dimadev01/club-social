import { IsEnum } from 'class-validator';

import { GetPriceByDueCategoryRequest } from '@application/prices/use-cases/get-price-by-due-category/get-price-by-due-category.request';
import { DueCategoryEnum } from '@domain/dues/due.enum';

export class GetPriceByDueCategoryRequestDto
  implements GetPriceByDueCategoryRequest
{
  @IsEnum(DueCategoryEnum)
  public dueCategory!: DueCategoryEnum;
}
