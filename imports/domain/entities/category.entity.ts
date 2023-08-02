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
import { FullEntity } from '@domain/common/full-entity.base';
import { CategoryHistorical } from '@domain/entities/category-historical.entity';
import {
  CategoryEnum,
  CategoryLabel,
  CategoryPrices,
  CategoryType,
  CategoryTypes,
} from '@domain/enums/categories.enum';
import { CurrencyUtils } from '@shared/utils/currency.utils';

export class Category extends FullEntity {
  // #region Properties (7)

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

  // #endregion Properties (7)

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

  // #endregion Constructors (1)

  // #region Public Accessors (1)

  public get amountFormatted(): string | null {
    if (!this.amount) {
      return null;
    }

    return CurrencyUtils.formatCents(this.amount);
  }

  // #endregion Public Accessors (1)

  // #region Public Static Methods (1)

  public static create(code: CategoryEnum): Category {
    const category = new Category();

    category.code = code;

    const price: number | null = CategoryPrices[category.code];

    category.amount = price ? CurrencyUtils.toCents(price) : null;

    category.type = CategoryTypes[category.code];

    category.name = CategoryLabel[category.code];

    return category;
  }

  // #endregion Public Static Methods (1)
}
