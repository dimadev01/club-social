import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { err, ok, Result } from 'neverthrow';
import {
  CategoryEnum,
  CategoryTypeEnum,
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

  public constructor() {
    super();
  }

  public get amountFormatted(): string {
    if (!this.amount) {
      return '';
    }

    return CurrencyUtils.formatCents(this.amount);
  }

  public updatePrice(amount: number | null): Result<null, Error> {
    if (amount && amount < 0) {
      return err(new Error('Amount must be greater than or equal to zero'));
    }

    if (amount) {
      this.amount = CurrencyUtils.toCents(amount);
    } else {
      this.amount = amount;
    }

    return ok(null);
  }
}
