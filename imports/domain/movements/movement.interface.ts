import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { IModel } from '@domain/common/models/model.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';

export interface IMovement extends IModel {
  amount: Money;
  category: MovementCategoryEnum;
  date: DateUtcVo;
  employeeId: string | null;
  notes: string | null;
  paymentId: string | null;
  professorId: string | null;
  serviceId: string | null;
  type: MovementTypeEnum;
}

export interface CreateMovement {
  amount: Money;
  category: MovementCategoryEnum;
  date: DateUtcVo;
  employeeId: string | null;
  notes: string | null;
  paymentId: string | null;
  professorId: string | null;
  serviceId: string | null;
  type: MovementTypeEnum;
}

export interface CreatePayment {
  amount: Money;
  date: DateUtcVo;
  notes: string | null;
  paymentId: string;
}
