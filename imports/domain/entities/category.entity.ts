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
  CategoryTypeEnum,
  CategoryTypes,
} from '@domain/enums/categories.enum';
import { CurrencyUtils } from '@shared/utils/currency.utils';

export class Category extends FullEntity {
  // #region Properties (7)

  @IsInt()
  @IsOptional()
  public amount: number | null;

  @IsEnum(CategoryEnum)
  public code: CategoryEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryHistorical)
  public historical: CategoryHistorical[];

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsEnum(CategoryTypeEnum)
  public type: CategoryTypeEnum;

  @IsDate()
  public updatedAt: Date;

  @IsString()
  public updatedBy: string;

  // #endregion Properties (7)

  // #region Constructors (1)

  public constructor() {
    super();
  }

  // #endregion Constructors (1)

  // #region Public Accessors (1)

  public get amountFormatted(): string {
    if (!this.amount) {
      return '';
    }

    return CurrencyUtils.formatCents(this.amount);
  }

  // #endregion Public Accessors (1)

  // #region Public Static Methods (1)

  public static create(code: CategoryEnum): Category {
    const category = new Category();

    category.amount = null;

    category.code = CategoryEnum.CourtRental;

    category.name = CategoryLabel[category.code];

    category.updatedAt = new Date();

    category.updatedBy = 'System';

    category.historical = [];

    category.code = code;

    const price: number | null = CategoryPrices[category.code];

    category.amount = price ? CurrencyUtils.toCents(price) : null;

    category.type = CategoryTypes[category.code];

    category.name = CategoryLabel[category.code];

    return category;
  }

  // #endregion Public Static Methods (1)

  // #region Public Methods (1)

  public updatePrice(amount: number | null): void {
    this.amount = amount;
  }

  public updateName(name: string): void {
    this.name = name;
  }

  public addHistorical() {
    this.historical.push({
      amount: this.amount,
      date: this.updatedAt,
    });
  }

  // #endregion Public Methods (1)
}
