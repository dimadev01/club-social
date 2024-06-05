import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due.entity';

export class DueEntity extends Entity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsEnum(DueCategoryEnum)
  public category: DueCategoryEnum;

  @IsDate()
  public date: Date;

  public member?: MemberEntity;

  @IsNotEmpty()
  @IsString()
  public memberId: string;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  public notes: string | null;

  public payments?: PaymentDueEntity[];

  @IsEnum(DueStatusEnum)
  public status: DueStatusEnum;

  public constructor(props: DueEntity) {
    super(props);

    this.amount = props.amount;

    this.category = props.category;

    this.date = props.date;

    this.memberId = props.memberId;

    this.notes = props.notes;

    this.status = props.status;
  }
}
