import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';

import { DueCategoryEnum } from '@domain/dues/due.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { PriceCategoryEntity } from '@infra/mongo/entities/price-category.entity';

export class PriceEntity extends Entity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @ValidateNested({ each: true })
  @Type(() => PriceCategoryEntity)
  @IsArray()
  public categories: PriceCategoryEntity[];

  @IsEnum(DueCategoryEnum)
  public dueCategory: DueCategoryEnum;

  public constructor(props: PriceEntity) {
    super(props);

    this.amount = props.amount;

    this.dueCategory = props.dueCategory;

    this.categories = props.categories;
  }
}
