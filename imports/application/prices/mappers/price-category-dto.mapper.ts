import { injectable } from 'tsyringe';

import { PriceCategoryDto } from '@application/prices/dtos/price-category.dto';
import { PriceCategory } from '@domain/prices/models/price-category.model';
import { MapperDto } from '@ui/common/mapper/dto-mapper';

@injectable()
export class PriceCategoryDtoMapper extends MapperDto<
  PriceCategory,
  PriceCategoryDto
> {
  public toDto(priceCategory: PriceCategory): PriceCategoryDto {
    return {
      amount: priceCategory.amount.amount,
      memberCategory: priceCategory.memberCategory,
    };
  }
}
