import { injectable } from 'tsyringe';

import { PriceDto } from '@application/prices/dtos/price.dto';
import { Price } from '@domain/prices/models/price.model';
import { MapperDto } from '@ui/common/mapper/dto-mapper';

@injectable()
export class PriceDtoMapper extends MapperDto<Price, PriceDto> {
  public toDto(price: Price): PriceDto {
    return {
      amount: price.amount.amount,
      dueCategory: price.dueCategory,
      memberCategory: price.memberCategory,
      updatedAt: price.updatedAt.toISOString(),
      updatedBy: price.updatedBy,
    };
  }
}
