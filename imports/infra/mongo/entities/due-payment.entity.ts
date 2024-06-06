import {
  IsDate,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';

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

  public constructor(props: DuePaymentEntity) {
    this.amount = props.amount;

    this.paymentId = props.paymentId;

    this.date = props.date;

    this.receiptNumber = props.receiptNumber;
  }
}
