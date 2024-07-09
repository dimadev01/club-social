import { Money } from '@domain/common/value-objects/money.value-object';
import { MemberCategoryEnum } from '@domain/members/member.enum';
import { IPriceCategory } from '@domain/prices/price.interface';

export class PriceCategory implements IPriceCategory {
  private _amount: Money;

  private _category: MemberCategoryEnum;

  public constructor(props?: IPriceCategory) {
    this._amount = props?.amount ?? Money.from();

    this._category = props?.category ?? MemberCategoryEnum.MEMBER;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get category(): MemberCategoryEnum {
    return this._category;
  }
}
