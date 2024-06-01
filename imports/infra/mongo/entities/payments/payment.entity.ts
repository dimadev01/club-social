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
import { IMemberEntity } from '@infra/mongo/entities/members/member-entity.interface';
import { PaymentDueEntity } from '@infra/mongo/entities/payment-due/payment-due.entity';
import { IPaymentEntity } from '@infra/mongo/entities/payments/payment-entity.interface';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class PaymentEntity extends EntityNewV implements IPaymentEntity {
  @IsDate()
  public date: Date;

  public dues: PaymentDueEntity[];

  public member: IMemberEntity | undefined;

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

    this.dues = props.dues;
  }
}
