import { IModel } from '@domain/common/models/model.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export interface IDue extends IModel {
  amount: Money;
  category: DueCategoryEnum;
  date: DateUtcVo;
  memberId: string;
  notes: string | null;
  status: DueStatusEnum;
}

export interface CreateDue {
  amount: Money;
  category: DueCategoryEnum;
  date: DateUtcVo;
  memberId: string;
  notes: string | null;
}
