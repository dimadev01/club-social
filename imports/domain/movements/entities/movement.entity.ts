import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
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
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';

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

  public constructor() {
    super();
  }

  public get amountFormatted(): string {
    return CurrencyUtils.formatCents(this.amount);
  }

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date, DateFormatEnum.DDMMYYYY);
  }

  public static create(props: CreateMovement): Movement {
    const movement = new Movement();

    movement.category = props.category;

    movement.amount = props.amount;

    movement.date = new Date(props.date);

    movement.memberId = props.memberId;

    movement.serviceId = props.serviceId;

    movement.employeeId = props.employeeId;

    movement.professorId = props.professorId;

    movement.notes = props.notes;

    movement.type = props.type;

    return movement;
  }
}
