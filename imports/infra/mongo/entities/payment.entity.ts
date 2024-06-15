import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due.entity';
import { IsNullable } from '@ui/common/class-validator/is-nullable';

export class PaymentEntity extends Entity {
  @IsPositive()
  @IsNumber()
  @IsNullable()
  public amount: number;

  @IsDate()
  public date: Date;

  @ValidateNested({ each: true })
  @Type(() => PaymentDueEntity)
  @IsArray()
  public dues: PaymentDueEntity[];

  public member?: MemberEntity;

  @IsNotEmpty()
  @IsString()
  public memberId: string;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  public notes: string | null;

  @IsPositive()
  @IsNumber()
  @IsNullable()
  public receiptNumber: number | null;

  @IsEnum(PaymentStatusEnum)
  public status: PaymentStatusEnum;

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

  public constructor(props: PaymentEntity) {
    super(props);

    this.amount = props.amount;

    this.date = props.date;

    this.memberId = props.memberId;

    this.notes = props.notes;

    this.receiptNumber = props.receiptNumber;

    this.status = props.status;

    this.dues = props.dues;

    this.member = props.member;

    this.voidReason = props.voidReason;

    this.voidedAt = props.voidedAt;

    this.voidedBy = props.voidedBy;
  }
}
