import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { MemberCategoryEnum } from '@domain/members/member.enum';
import { Entity } from '@infra/mongo/common/entities/entity';

export class PriceCategoryEntity extends Entity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  public priceId: string;

  @IsEnum(MemberCategoryEnum)
  public memberCategory: MemberCategoryEnum;

  public constructor(props: PriceCategoryEntity) {
    super(props);

    this.amount = props.amount;

    this.priceId = props.priceId;

    this.memberCategory = props.memberCategory;
  }
}
