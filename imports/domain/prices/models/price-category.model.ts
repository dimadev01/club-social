import { Model } from '@domain/common/models/model';
import { Money } from '@domain/common/value-objects/money.value-object';
import { MemberCategoryEnum } from '@domain/members/member.enum';
import { IPriceCategory } from '@domain/prices/price.interface';

export class PriceCategory extends Model implements IPriceCategory {
  private _amount: Money;

  private _category: MemberCategoryEnum;

  private _priceId: string;

  public constructor(props?: IPriceCategory) {
    super(props);

    this._amount = props?.amount ?? Money.from();

    this._category = props?.memberCategory ?? MemberCategoryEnum.MEMBER;

    this._priceId = props?.priceId ?? '';
  }

  public get amount(): Money {
    return this._amount;
  }

  public get memberCategory(): MemberCategoryEnum {
    return this._category;
  }

  public get priceId(): string {
    return this._priceId;
  }
}
