import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { Due } from '@domain/dues/entities/due.entity';
import { EntityNewV } from '@infra/mongo/entities/entity';
import { IPaymentDueEntity } from '@infra/mongo/interfaces/payment-due-entity.interface';
import { IPaymentEntity } from '@infra/mongo/interfaces/payment-entity.interface';

export class PaymentDueEntity extends EntityNewV implements IPaymentDueEntity {
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
