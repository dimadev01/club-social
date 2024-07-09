import { IsEnum } from 'class-validator';

import { GetPriceRequest } from '@application/prices/use-cases/get-price/get-price-request';
import { DueCategoryEnum } from '@domain/dues/due.enum';

export class GetPriceRequestDto implements GetPriceRequest {
  @IsEnum(DueCategoryEnum)
  public dueCategory!: DueCategoryEnum;
}
