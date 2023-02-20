import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { err, ok, Result } from 'neverthrow';
import { MovementMember } from '@domain/movements/movement-member.entity';
import { MovementCategory } from '@domain/movements/movements.enum';
import { CreateMovement } from '@domain/movements/movements.types';
import { Entity } from '@kernel/entity.base';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Movement extends Entity {
  // #region Properties (5)

  @IsNumber()
  public amount: number;

  @IsEnum(MovementCategory)
  public category: MovementCategory;

  @IsDate()
  public date: Date;

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date, DateFormats.DD_MM_YYYY);
  }

  @Type(() => MovementMember)
  @IsOptional()
  public member: MovementMember | null;

  @IsString()
  @IsOptional()
  public notes: string | null;

  // #endregion Properties (5)

  // #region Constructors (1)

  public constructor() {
    super();

    this.member = null;

    this.category = MovementCategory.Membership;
  }

  // #endregion Constructors (1)

  // #region Public Static Methods (1)

  public static create(props: CreateMovement): Result<Movement, Error> {
    const movement = new Movement();

    movement.category = props.category;

    movement.amount = props.amount;

    movement.date = new Date(props.date);

    movement.member = props.member;

    movement.notes = props.notes;

    const errors = validateSync(movement);

    if (errors.length > 0) {
      return err(ValidationUtils.getError(errors));
    }

    return ok(movement);
  }

  // #endregion Public Static Methods (1)
}
