import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { DueCategoryEnum } from '@domain/dues/due.enum';
import { PaymentDueSourceEnum } from '@domain/payments/payment.enum';

export class PaymentDueEntityNew {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsInt()
  @IsPositive()
  @IsNumber()
  public dueAmount: number;

  @IsEnum(DueCategoryEnum)
  public dueCategory: DueCategoryEnum;

  @IsDate()
  public dueDate: Date;

  @IsNotEmpty()
  @IsString()
  public dueId: string;

  @IsEnum(PaymentDueSourceEnum)
  public source: PaymentDueSourceEnum;

  public constructor(props: PaymentDueEntityNew) {
    this.amount = props.amount;

    this.dueCategory = props.dueCategory;

    this.dueAmount = props.dueAmount;

    this.dueDate = props.dueDate;

    this.dueId = props.dueId;

    this.source = props.source;
  }
}
