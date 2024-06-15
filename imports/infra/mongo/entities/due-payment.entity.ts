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

import {
  PaymentDueSourceEnum,
  PaymentStatusEnum,
} from '@domain/payments/payment.enum';
import { IsNullable } from '@ui/common/class-validator/is-nullable';

export class DuePaymentEntity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public totalAmount: number;

  @IsInt()
  @IsNumber()
  public creditAmount: number;

  @IsInt()
  @IsNumber()
  public directAmount: number;

  @IsEnum(PaymentDueSourceEnum)
  public source: PaymentDueSourceEnum;

  @IsDate()
  public paymentDate: Date;

  @IsNotEmpty()
  @IsString()
  public paymentId: string;

  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNullable()
  @IsDefined()
  public paymentReceiptNumber: number | null;

  @IsEnum(PaymentStatusEnum)
  public paymentStatus: PaymentStatusEnum;

  public constructor(props: DuePaymentEntity) {
    this.totalAmount = props.totalAmount;

    this.paymentId = props.paymentId;

    this.paymentDate = props.paymentDate;

    this.paymentReceiptNumber = props.paymentReceiptNumber;

    this.paymentStatus = props.paymentStatus;

    this.creditAmount = props.creditAmount;

    this.directAmount = props.directAmount;

    this.source = props.source;
  }
}
