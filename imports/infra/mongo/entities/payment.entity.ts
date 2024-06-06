import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { PaymentDueEntityNew } from '@infra/mongo/entities/payment-due.entity-new';

export class PaymentEntity extends Entity {
  @IsPositive()
  @IsNumber()
  @IsNullable()
  public amount: number;

  @IsDate()
  public date: Date;

  @ValidateNested({ each: true })
  @Type(() => PaymentDueEntityNew)
  @IsArray()
  public dues: PaymentDueEntityNew[];

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

  public constructor(props: PaymentEntity) {
    super(props);

    this.amount = props.amount;

    this.date = props.date;

    this.memberId = props.memberId;

    this.notes = props.notes;

    this.receiptNumber = props.receiptNumber;

    this.status = props.status;

    this.dues = props.dues;
  }
}
