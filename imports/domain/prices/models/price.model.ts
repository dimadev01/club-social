import { Model } from '@domain/common/models/model';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { PriceCategory } from '@domain/prices/models/price-category.model';
import { IPrice } from '@domain/prices/price.interface';

export class Price extends Model implements IPrice {
  private _amount: Money;

  private _categories?: PriceCategory[];

  private _dueCategory: DueCategoryEnum;

  public constructor(props?: IPrice, categories?: PriceCategory[]) {
    super(props);

    this._amount = props?.amount ?? Money.from();

    this._dueCategory = props?.dueCategory ?? DueCategoryEnum.MEMBERSHIP;

    this._categories = categories;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get categories(): PriceCategory[] | undefined {
    return this._categories;
  }

  public set categories(value: PriceCategory[]) {
    this._categories = value;
  }

  public get dueCategory(): DueCategoryEnum {
    return this._dueCategory;
  }

  public set dueCategory(value: DueCategoryEnum) {
    this._dueCategory = value;
  }
}
