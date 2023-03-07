import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CategoryEnum,
  CategoryLabel,
  CategoryPrices,
  CategoryType,
  CategoryTypes,
} from '@domain/categories/categories.enum';
import { CategoryHistorical } from '@domain/categories/category-historical.entity';
import { Entity } from '@kernel/entity.base';
import { CurrencyUtils } from '@shared/utils/currency.utils';

export class Category extends Entity {
  // #region Properties (6)

  @IsInt()
  @IsOptional()
  public amount: number | null;

  @IsString()
  @IsNotEmpty()
  public code: CategoryEnum;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CategoryHistorical)
  public historical: CategoryHistorical[] | null;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsEnum(CategoryType)
  public type: CategoryType;

  @IsDate()
  public updatedAt: Date;

  @IsString()
  public updatedBy: string;

  // #endregion Properties (6)

  // #region Constructors (1)

  public constructor() {
    super();

    this.amount = null;

    this.code = CategoryEnum.CourtRental;

    this.name = CategoryLabel[this.code];

    this.updatedAt = new Date();

    this.updatedBy = 'System';

    this.historical = null;
  }

  public static create(code: CategoryEnum): Category {
    const category = new Category();

    category.code = code;

    const price: number | null = CategoryPrices[category.code];

    category.amount = price ? CurrencyUtils.toCents(price) : null;

    category.type = CategoryTypes[category.code];

    category.name = CategoryLabel[category.code];

    return category;
  }

  // #endregion Constructors (1)

  // #region Public Accessors (1)

  public get amountFormatted(): string | null {
    if (this.amount) {
      return CurrencyUtils.formatCents(this.amount);
    }

    return null;
  }

  // #endregion Public Accessors (1)
}
