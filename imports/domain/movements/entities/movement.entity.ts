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

import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/category.enum';
import { Entity } from '@domain/common/entity';
import { Employee } from '@domain/employees/employee.entity';
import { Member } from '@domain/members/entities/member.entity';
import { CreateMovement } from '@domain/movements/movement.types';
import { Professor } from '@domain/professors/professor.entity';
import { Service } from '@domain/services/service.entity';
import { IsNullable } from '@shared/class-validator/is-nullable';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { MoneyUtils } from '@shared/utils/money.utils';

export class Movement extends Entity {
  @IsInt()
  public amount: number;

  @IsEnum(CategoryEnum)
  public category: CategoryEnum;

  @IsDate()
  public date: Date;

  @IsOptional()
  @Type(() => Employee)
  public employee: Employee | null;

  @IsString()
  @IsOptional()
  public employeeId: string | null;

  @IsOptional()
  @Type(() => Member)
  public member: Member | null;

  @IsString()
  @IsOptional()
  public memberId: string | null;

  @IsString()
  @IsOptional()
  public notes: string | null;

  @IsOptional()
  @Type(() => Professor)
  public professor: Professor | null;

  @IsString()
  @IsOptional()
  public professorId: string | null;

  @IsOptional()
  @Type(() => Service)
  public service: Service | null;

  @IsString()
  @IsOptional()
  public serviceId: string | null;

  @IsEnum(CategoryTypeEnum)
  public type: CategoryTypeEnum;

  @IsBoolean()
  @IsOptional()
  public isMigrated: boolean | null;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  public paymentId: string | null;

  public constructor() {
    super();
  }

  public get amountFormatted(): string {
    return MoneyUtils.formatCents(this.amount);
  }

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date, DateFormatEnum.DDMMYYYY);
  }

  public static create(props: CreateMovement): Result<Movement, Error> {
    const movement = new Movement();

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

  public setAmount(amount: number): Result<null, Error> {
    this.amount = amount;

    return ok(null);
  }

  public setCategory(category: CategoryEnum): Result<null, Error> {
    this.category = category;

    return ok(null);
  }

  public setDate(date: Date): Result<null, Error> {
    this.date = date;

    return ok(null);
  }

  public setEmployeeId(employeeId: string | null): Result<null, Error> {
    this.employeeId = employeeId;

    return ok(null);
  }

  public setMemberId(memberId: string | null): Result<null, Error> {
    this.memberId = memberId;

    return ok(null);
  }

  public setNotes(notes: string | null): Result<null, Error> {
    this.notes = notes;

    return ok(null);
  }

  public setProfessorId(professorId: string | null): Result<null, Error> {
    this.professorId = professorId;

    return ok(null);
  }

  public setServiceId(serviceId: string | null): Result<null, Error> {
    this.serviceId = serviceId;

    return ok(null);
  }

  public setType(type: CategoryTypeEnum): Result<null, Error> {
    this.type = type;

    return ok(null);
  }
}
