import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { EntityNewV } from '@infra/mongo/entities/common/entity';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class PaymentEntity extends EntityNewV {
  @IsDate()
  public date: Date;

  @IsNotEmpty()
  @IsString()
  public memberId: string;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  public notes: string | null;

  @IsPositive()
  @IsNumber()
  @IsNullable()
  public receiptNumber: number | null;

  @IsEnum(PaymentStatusEnum)
  public status: PaymentStatusEnum;

  public constructor(props: PaymentEntity) {
    super(props);

    this.date = props.date;

    this.memberId = props.memberId;

    this.notes = props.notes;

    this.receiptNumber = props.receiptNumber;

    this.status = props.status;
  }
}
