import { IsEnum, IsInt, IsNumber, IsPositive } from 'class-validator';

import { DueCategoryEnum } from '@domain/dues/due.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { PriceCategoryEntity } from '@infra/mongo/entities/price-category.entity';

export class PriceEntity extends Entity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsEnum(DueCategoryEnum)
  public dueCategory: DueCategoryEnum;

  public categories?: PriceCategoryEntity[];

  public constructor(props: PriceEntity) {
    super(props);

    this.amount = props.amount;

    this.dueCategory = props.dueCategory;
  }
}
