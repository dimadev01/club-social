import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { Entity } from '@adapters/common/entities/entity';
import { MemberEntity } from '@adapters/members/entities/member.entity';
import { PaymentDueEntity } from '@adapters/mongo/entities/payment-due.entity';
import { IPaymentEntity } from '@adapters/mongo/interfaces/payment-entity.interface';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { IsNullable } from '@shared/class-validator/is-nullable';

export class PaymentEntity extends Entity implements IPaymentEntity {
  @IsDate()
  public date: Date;

  public dues: PaymentDueEntity[] | undefined;

  public member: MemberEntity | undefined;

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
