import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due.entity';

export class PaymentEntity extends Entity {
  @IsDate()
  public date: Date;

  public dues?: PaymentDueEntity[];

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

    this.date = props.date;

    this.memberId = props.memberId;

    this.notes = props.notes;

    this.receiptNumber = props.receiptNumber;

    this.status = props.status;
  }
}
