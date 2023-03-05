import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import {
  CategoryEnum,
  CategoryLabel,
} from '@domain/categories/categories.enum';
import { CategoryHistorical } from '@domain/categories/category-historical.entity';
import { Entity } from '@kernel/entity.base';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { ValidationUtils } from '@shared/utils/validation.utils';

export class Category extends Entity {
  // #region Properties (2)

  @IsInt()
  @IsOptional()
  public amount: number | null;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public code: string;

  @IsDate()
  public updatedAt: Date;

  @IsString()
  public updatedBy: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CategoryHistorical)
  historical: CategoryHistorical[] | null;

  // #endregion Properties (2)

  // #region Constructors (1)

  public constructor(amount: number | null, code: CategoryEnum) {
    super();

    if (amount !== null) {
      this.amount = CurrencyUtils.toCents(amount);
    } else {
      this.amount = amount;
    }

    this.code = code;

    this.name = CategoryLabel[code];

    this.updatedAt = new Date();

    this.updatedBy = 'System';

    if (this.amount !== null) {
      this.historical = [
        {
          amount: this.amount,
          date: this.updatedAt,
        },
      ];
    } else {
      this.historical = null;
    }

    const errors = validateSync(this);

    if (errors.length > 0) {
      throw ValidationUtils.getError(errors);
    }
  }

  // #endregion Constructors (1)

  // #region Public Accessors (1)

  public get amountFormatted(): string | null {
    if (this.amount === null) {
      return null;
    }

    return CurrencyUtils.formatCents(this.amount);
  }

  // #endregion Public Accessors (1)
}
