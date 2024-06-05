import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { PaymentDueSourceEnum } from '@domain/payments/payment.enum';
import { Entity } from '@infra/mongo/common/entities/entity';

export class PaymentDueEntity extends Entity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  public dueId: string;

  @IsNotEmpty()
  @IsString()
  public paymentId: string;

  @IsEnum(PaymentDueSourceEnum)
  public source: PaymentDueSourceEnum;

  public constructor(props: PaymentDueEntity) {
    super(props);

    this.amount = props.amount;

    this.dueId = props.dueId;

    this.paymentId = props.paymentId;

    this.source = props.source;
  }
}
