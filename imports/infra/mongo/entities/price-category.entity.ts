import { IsEnum, IsInt, IsNumber, IsPositive } from 'class-validator';

import { MemberCategoryEnum } from '@domain/members/member.enum';

export class PriceCategoryEntity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsEnum(MemberCategoryEnum)
  public category: MemberCategoryEnum;

  public constructor(props: PriceCategoryEntity) {
    this.amount = props.amount;

    this.category = props.category;
  }
}
