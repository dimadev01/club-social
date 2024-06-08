import {
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export class DuePaymentEntity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsDate()
  public date: Date;

  @IsNotEmpty()
  @IsString()
  public paymentId: string;

  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNullable()
  @IsDefined()
  public receiptNumber: number | null;

  @IsEnum(PaymentStatusEnum)
  public status: PaymentStatusEnum;

  public constructor(props: DuePaymentEntity) {
    this.amount = props.amount;

    this.paymentId = props.paymentId;

    this.date = props.date;

    this.receiptNumber = props.receiptNumber;

    this.status = props.status;
  }
}
