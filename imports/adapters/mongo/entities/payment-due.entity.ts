import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { Entity } from '@adapters/common/entities/entity';
import { IPaymentDueEntity } from '@adapters/mongo/interfaces/payment-due-entity.interface';
import { IPaymentEntity } from '@adapters/mongo/interfaces/payment-entity.interface';
import { Due } from '@domain/dues/entities/due.entity';

export class PaymentDueEntity extends Entity implements IPaymentDueEntity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  public due: Due | undefined;

  @IsNotEmpty()
  @IsString()
  public dueId: string;

  public payment: IPaymentEntity | undefined;

  @IsNotEmpty()
  @IsString()
  public paymentId: string;

  public constructor(props: PaymentDueEntity) {
    super(props);

    this.amount = props.amount;

    this.dueId = props.dueId;

    this.due = props.due;

    this.paymentId = props.paymentId;

    this.payment = props.payment;
  }
}
