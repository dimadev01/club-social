import { injectable } from 'tsyringe';

import { PriceDto } from '@application/prices/dtos/price.dto';
import { Price } from '@domain/prices/models/price.model';
import { MapperDto } from '@ui/common/mapper/dto-mapper';

@injectable()
export class PriceDtoMapper extends MapperDto<Price, PriceDto> {
  public toDto(price: Price): PriceDto {
    return {
      amount: price.amount.amount,
      categories: price.categories.map((category) => ({
        amount: category.amount.amount,
        category: category.category,
      })),
      dueCategory: price.dueCategory,
      id: price._id,
      updatedAt: price.updatedAt.toISOString(),
      updatedBy: price.updatedBy,
    };
  }
}
