import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Result, err, ok } from 'neverthrow';

import { IsNullable } from '@adapters/common/class-validator/is-nullable';
import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { EntityOld } from '@domain/common/entity.old';
import { CreateMovement } from '@domain/movements/movement.types';
import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { MoneyUtils } from '@shared/utils/money.utils';

export class OldMovement extends EntityOld {
  @IsInt()
  public amount!: number;

  @IsEnum(MovementCategoryEnum)
  public category!: MovementCategoryEnum;

  @IsDate()
  public date!: Date;

  @IsString()
  @IsOptional()
  public employeeId!: string | null;

  @IsOptional()
  @Type(() => MemberEntity)
  public member!: MemberEntity | null;

  @IsString()
  @IsOptional()
  public memberId!: string | null;

  @IsString()
  @IsOptional()
  public notes!: string | null;

  @IsString()
  @IsOptional()
  public professorId!: string | null;

  @IsString()
  @IsOptional()
  public serviceId!: string | null;

  @IsEnum(MovementTypeEnum)
  public type!: MovementTypeEnum;

  @IsBoolean()
  @IsOptional()
  public isMigrated!: boolean | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  public paymentId!: string | null;

  public constructor() {
    super();
  }

  public get amountFormatted(): string {
    return MoneyUtils.formatCents(this.amount);
  }

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date, DateFormatEnum.DDMMYYYY);
  }

  public static create(props: CreateMovement): Result<OldMovement, Error> {
    const movement = new OldMovement();

    const updateResult = Result.combine([
      movement.setCategory(props.category),
      movement.setAmount(props.amount),
      movement.setDate(new Date(props.date)),
      movement.setEmployeeId(props.employeeId),
      movement.setMemberId(props.memberId),
      movement.setNotes(props.notes),
      movement.setProfessorId(props.professorId),
      movement.setServiceId(props.serviceId),
      movement.setType(props.type),
    ]);

    movement.isMigrated = null;

    movement.paymentId = null;

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    return ok(movement);
  }

  private setAmount(amount: number): Result<null, Error> {
    this.amount = amount;

    return ok(null);
  }

  private setCategory(category: MovementCategoryEnum): Result<null, Error> {
    this.category = category;

    return ok(null);
  }

  private setDate(date: Date): Result<null, Error> {
    this.date = date;

    return ok(null);
  }

  private setEmployeeId(employeeId: string | null): Result<null, Error> {
    this.employeeId = employeeId;

    return ok(null);
  }

  private setMemberId(memberId: string | null): Result<null, Error> {
    this.memberId = memberId;

    return ok(null);
  }

  private setNotes(notes: string | null): Result<null, Error> {
    this.notes = notes;

    return ok(null);
  }

  private setProfessorId(professorId: string | null): Result<null, Error> {
    this.professorId = professorId;

    return ok(null);
  }

  private setServiceId(serviceId: string | null): Result<null, Error> {
    this.serviceId = serviceId;

    return ok(null);
  }

  private setType(type: MovementTypeEnum): Result<null, Error> {
    this.type = type;

    return ok(null);
  }
}
