import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { err, ok, Result } from 'neverthrow';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { MovementMember } from '@domain/movements/movement-member.entity';
import { CreateMovement } from '@domain/movements/movements.types';
import { FullEntity } from '@kernel/full-entity.base';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Movement extends FullEntity {
  // #region Properties (5)

  @IsInt()
  public amount: number;

  public get amountFormatted(): string {
    return CurrencyUtils.format(this.amount);
  }

  @IsEnum(CategoryEnum)
  public category: CategoryEnum;

  @IsDate()
  public date: Date;

  public get dateFormatted(): string {
    return DateUtils.formatUtc(this.date, DateFormats.DD_MM_YYYY);
  }

  @IsOptional()
  @Type(() => MovementMember)
  @ValidateNested()
  public member: MovementMember | null;

  @IsString()
  @IsOptional()
  public notes: string | null;

  // #endregion Properties (5)

  // #region Constructors (1)

  public constructor() {
    super();

    this.amount = 0;

    this.date = new Date();

    this.member = null;

    this.category = CategoryEnum.Membership;

    this.notes = null;
  }

  // #endregion Constructors (1)

  // #region Public Static Methods (1)

  public static create(props: CreateMovement): Result<Movement, Error> {
    const movement = new Movement();

    movement.category = props.category;

    movement.amount = props.amount;

    movement.date = new Date(props.date);

    if (props.member) {
      const movementMember = MovementMember.create(props.member);

      if (movementMember.isErr()) {
        return err(movementMember.error);
      }

      movement.member = movementMember.value;
    }

    movement.notes = props.notes;

    const errors = validateSync(movement);

    if (errors.length > 0) {
      return err(ValidationUtils.getError(errors));
    }

    return ok(movement);
  }

  // #endregion Public Static Methods (1)
}
