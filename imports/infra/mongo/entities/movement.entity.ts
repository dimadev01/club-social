import {
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { PaymentEntity } from '@infra/mongo/entities/payment.entity';

export class MovementEntity extends Entity {
  @IsInt()
  @IsPositive()
  @IsNumber()
  public amount: number;

  @IsEnum(MovementCategoryEnum)
  public category: MovementCategoryEnum;

  @IsDate()
  public date: Date;

  @IsString()
  @IsNullable()
  @IsDefined()
  public employeeId: string | null;

  @IsString()
  @IsNullable()
  @IsDefined()
  public notes: string | null;

  public payment?: PaymentEntity;

  @IsString()
  @IsNullable()
  @IsDefined()
  public paymentId: string | null;

  @IsString()
  @IsNullable()
  @IsDefined()
  public professorId: string | null;

  @IsString()
  @IsNullable()
  @IsDefined()
  public serviceId: string | null;

  @IsEnum(MovementTypeEnum)
  public type: MovementTypeEnum;

  public constructor(props: MovementEntity) {
    super(props);

    this.amount = props.amount;

    this.category = props.category;

    this.date = props.date;

    this.employeeId = props.employeeId;

    this.notes = props.notes;

    this.professorId = props.professorId;

    this.serviceId = props.serviceId;

    this.type = props.type;

    this.paymentId = props.paymentId;
  }
}
