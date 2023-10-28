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
  CategoryTypeEnum,
  CategoryTypes,
} from '@domain/categories/category.enum';
import { CategoryHistorical } from '@domain/categories/entities/category-historical.entity';
import { FullEntity } from '@domain/common/full-entity.base';
import { CurrencyUtils } from '@shared/utils/currency.utils';

export class Category extends FullEntity {
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

  public constructor() {
    super();
  }

  public get amountFormatted(): string {
    if (!this.amount) {
      return '';
    }

    return CurrencyUtils.formatCents(this.amount);
  }

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

  public addHistorical() {
    this.historical.push({
      amount: this.amount,
      date: this.updatedAt,
    });
  }

  public updateName(name: string): void {
    this.name = name;
  }

  public updatePrice(amount: number | null): void {
    this.amount = amount;
  }
}
