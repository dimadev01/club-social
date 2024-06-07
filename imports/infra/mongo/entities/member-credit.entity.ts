import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { MemberCreditTypeEnum } from '@domain/members/member.enum';
import { Entity } from '@infra/mongo/common/entities/entity';

export class MemberCreditEntity extends Entity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  public dueId: string;

  @IsNotEmpty()
  @IsString()
  public memberId: string;

  @IsNotEmpty()
  @IsString()
  public paymentId: string;

  @IsEnum(MemberCreditTypeEnum)
  public type: MemberCreditTypeEnum;

  public constructor(props: MemberCreditEntity) {
    super(props);

    this.memberId = props.memberId;

    this.amount = props.amount;

    this.paymentId = props.paymentId;

    this.dueId = props.dueId;

    this.type = props.type;
  }
}
