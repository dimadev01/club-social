import { Model } from '@domain/common/models/model';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { MemberCategoryEnum } from '@domain/members/member.enum';
import { IPrice } from '@domain/prices/price.interface';

export class Price extends Model implements IPrice {
  private _amount: Money;

  private _dueCategory: DueCategoryEnum;

  private _memberCategory: MemberCategoryEnum;

  public constructor(props?: IPrice) {
    super(props);

    this._amount = props?.amount ?? Money.from();

    this._dueCategory = props?.dueCategory ?? DueCategoryEnum.MEMBERSHIP;

    this._memberCategory = props?.memberCategory ?? MemberCategoryEnum.MEMBER;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get dueCategory(): DueCategoryEnum {
    return this._dueCategory;
  }

  public get memberCategory(): MemberCategoryEnum {
    return this._memberCategory;
  }
}
