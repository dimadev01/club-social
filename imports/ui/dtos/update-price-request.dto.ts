import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { UpdatePriceCategoryRequestDto } from './update-price-categories-request.dto';

import { UpdatePriceRequest } from '@application/prices/use-cases/update-price/update-price.request';

export class UpdatePriceRequestDto implements UpdatePriceRequest {
  @IsString()
  @IsNotEmpty()
  public id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePriceCategoryRequestDto)
  public categories!: UpdatePriceCategoryRequestDto[];
}
