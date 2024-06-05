import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

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

  public constructor(props: PaymentDueEntity) {
    super(props);

    this.amount = props.amount;

    this.dueId = props.dueId;

    this.paymentId = props.paymentId;
  }
}
