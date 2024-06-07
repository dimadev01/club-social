import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDefined,
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

  @IsInt()
  @IsNumber()
  public totalPaidAmount: number;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public voidReason: string | null;

  @IsDate()
  @IsNullable()
  @IsDefined()
  public voidedAt: Date | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public voidedBy: string | null;

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

    this.voidReason = props.voidReason;

    this.voidedAt = props.voidedAt;

    this.voidedBy = props.voidedBy;
  }
}
