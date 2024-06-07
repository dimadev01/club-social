import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { DuePaymentEntity } from '@infra/mongo/entities/due-payment.entity';
import { MemberEntity } from '@infra/mongo/entities/member.entity';

export class DueEntity extends Entity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsInt()
  @IsNumber()
  public totalPaidAmount: number;

  @IsInt()
  @IsNumber()
  public balanceAmount: number;

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

  @ValidateNested({ each: true })
  @Type(() => DuePaymentEntity)
  @IsArray()
  public payments: DuePaymentEntity[];

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

    this.payments = props.payments;

    this.balanceAmount = props.balanceAmount;

    this.totalPaidAmount = props.totalPaidAmount;
  }
}
