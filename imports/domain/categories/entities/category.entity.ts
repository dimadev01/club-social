import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Result, err, ok } from 'neverthrow';

import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/category.enum';
import { Entity } from '@domain/common/entity.old';
import { MoneyUtils } from '@shared/utils/money.utils';

export class Category extends Entity {
  @IsInt()
  @IsOptional()
  public amount: number | null;

  @IsEnum(CategoryEnum)
  public code: CategoryEnum;

  @IsNotEmpty()
  @IsString()
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

    return MoneyUtils.formatCents(this.amount);
  }

  public updatePrice(amount: number | null): Result<null, Error> {
    if (amount && amount < 0) {
      return err(new Error('Amount must be greater than or equal to zero'));
    }

    if (amount) {
      this.amount = MoneyUtils.toCents(amount);
    } else {
      this.amount = amount;
    }

    return ok(null);
  }
}
