import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  CategoryEnum,
  CategoryLabel,
  CategoryPrices,
  CategoryTypeEnum,
  CategoryTypes,
} from '@domain/categories/category.enum';
import { Entity } from '@domain/common/entity';
import { CurrencyUtils } from '@shared/utils/currency.utils';

export class Category extends Entity {
  @IsInt()
  @IsOptional()
  public amount: number | null;

  @IsEnum(CategoryEnum)
  public code: CategoryEnum;

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

    category.code = code;

    const price: number | null = CategoryPrices[category.code];

    category.amount = price ? CurrencyUtils.toCents(price) : null;

    category.type = CategoryTypes[category.code];

    category.name = CategoryLabel[category.code];

    return category;
  }

  public addHistorical() {}

  public updateName(name: string): void {
    this.name = name;
  }

  public updatePrice(amount: number | null): void {
    this.amount = amount;
  }
}
