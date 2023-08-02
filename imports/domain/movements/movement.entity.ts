import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { err, ok, Result } from 'neverthrow';
import { FullEntity } from '@domain/common/full-entity.base';
import { Employee } from '@domain/employees/employee.entity';
import { CategoryEnum, CategoryType } from '@domain/enums/categories.enum';
import { Member } from '@domain/members/member.entity';
import { CreateMovement } from '@domain/movements/movements.types';
import { Professor } from '@domain/professors/professor.entity';
import { Service } from '@domain/services/service.entity';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Movement extends FullEntity {
  // #region Properties (15)

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

  @IsEnum(CategoryType)
  public type: CategoryType;

  // #endregion Properties (15)

  // #region Constructors (1)

  public constructor() {
    super();

    this.amount = 0;

    this.date = new Date();

    this.member = null;

    this.category = CategoryEnum.MembershipIncome;

    this.notes = null;
  }

  // #endregion Constructors (1)

  // #region Public Accessors (2)

  public get amountFormatted(): string {
    const formatted = CurrencyUtils.formatCents(this.amount);

    // if (this.type === CategoryType.Expense || this.type === CategoryType.Debt) {
    //   return `(${formatted})`;
    // }

    return formatted;
  }

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date, DateFormats.DD_MM_YYYY);
  }

  // #endregion Public Accessors (2)

  // #region Public Static Methods (1)

  public static create(props: CreateMovement): Result<Movement, Error> {
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

    const errors = validateSync(movement);

    if (errors.length > 0) {
      return err(ValidationUtils.getError(errors));
    }

    return ok(movement);
  }

  // #endregion Public Static Methods (1)
}
