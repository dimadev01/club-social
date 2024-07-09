import { IModel } from '@domain/common/models/model.interface';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { MemberCategoryEnum } from '@domain/members/member.enum';

export interface IPrice extends IModel {
  amount: Money;
  categories: IPriceCategory[];
  dueCategory: DueCategoryEnum;
}

export interface IPriceCategory {
  amount: Money;
  category: MemberCategoryEnum;
}
