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

export class PaymentDueEntity {
  @IsInt()
  @IsNumber()
  public creditAmount: number;

  @IsInt()
  @IsNumber()
  public directAmount: number;

  @IsInt()
  @IsPositive()
  @IsNumber()
  public dueAmount: number;

  @IsInt()
  @IsPositive()
  @IsNumber()
  public duePendingAmount: number;

  @IsEnum(DueCategoryEnum)
  public dueCategory: DueCategoryEnum;

  @IsDate()
  public dueDate: Date;

  @IsNotEmpty()
  @IsString()
  public dueId: string;

  @IsEnum(PaymentDueSourceEnum)
  public source: PaymentDueSourceEnum;

  @IsInt()
  @IsNumber()
  public totalAmount: number;

  public constructor(props: PaymentDueEntity) {
    this.directAmount = props.directAmount;

    this.dueCategory = props.dueCategory;

    this.dueAmount = props.dueAmount;

    this.dueDate = props.dueDate;

    this.dueId = props.dueId;

    this.duePendingAmount = props.duePendingAmount;

    this.source = props.source;

    this.creditAmount = props.creditAmount;

    this.totalAmount = props.totalAmount;
  }
}
