import { injectable } from 'tsyringe';

import { PriceCategoryDto } from '@application/prices/dtos/price-category.dto';
import { PriceDto } from '@application/prices/dtos/price.dto';
import { Price } from '@domain/prices/models/price.model';
import { MapperDto } from '@ui/common/mapper/dto-mapper';

@injectable()
export class PriceDtoMapper extends MapperDto<Price, PriceDto> {
  public toDto(price: Price): PriceDto {
    return {
      amount: price.amount.amount,
      categories:
        price.categories?.map<PriceCategoryDto>((category) => ({
          amount: category.amount.amount,
          id: category._id,
          memberCategory: category.memberCategory,
        })) ?? [],
      dueCategory: price.dueCategory,
      id: price._id,
      updatedAt: price.updatedAt.toISOString(),
      updatedBy: price.updatedBy,
    };
  }
}
