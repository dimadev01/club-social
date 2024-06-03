import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { Entity } from '@infra/mongo/common/entities/entity';
import { DueEntity } from '@infra/mongo/entities/due.entity';

export class PaymentDueEntity extends Entity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  public due?: DueEntity;

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

    this.due = props.due;

    this.paymentId = props.paymentId;
  }
}
