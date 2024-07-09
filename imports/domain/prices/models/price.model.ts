import { Model } from '@domain/common/models/model';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { MemberCategorySortOrder } from '@domain/members/member.enum';
import { PriceCategory } from '@domain/prices/models/price-member.model';
import { IPrice } from '@domain/prices/price.interface';

export class Price extends Model implements IPrice {
  private _amount: Money;

  private _dueCategory: DueCategoryEnum;

  private _categories: PriceCategory[];

  public constructor(props?: IPrice) {
    super(props);

    this._amount = props?.amount ?? Money.from();

    this._dueCategory = props?.dueCategory ?? DueCategoryEnum.MEMBERSHIP;

    this._categories =
      props?.categories.map((price) => new PriceCategory(price)) ?? [];

    this.categories.sort(
      (a, b) =>
        MemberCategorySortOrder[a.category] -
        MemberCategorySortOrder[b.category],
    );
  }

  public get amount(): Money {
    return this._amount;
  }

  public get dueCategory(): DueCategoryEnum {
    return this._dueCategory;
  }

  public get categories(): PriceCategory[] {
    return this._categories;
  }
}
