import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { IModel } from '@domain/common/models/model.interface';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';

export interface IMovement extends IModel {
  amount: Money;
  category: MovementCategoryEnum;
  date: DateVo;
  employeeId: string | null;
  notes: string | null;
  paymentId: string | null;
  professorId: string | null;
  serviceId: string | null;
  status: MovementStatusEnum;
  type: MovementTypeEnum;
  voidReason: string | null;
  voidedAt: DateVo | null;
  voidedBy: string | null;
}

export interface CreateMovement {
  amount: Money;
  category: MovementCategoryEnum;
  date: DateVo;
  employeeId: string | null;
  notes: string | null;
  paymentId: string | null;
  professorId: string | null;
  serviceId: string | null;
  type: MovementTypeEnum;
}

export interface CreatePayment {
  amount: Money;
  date: DateVo;
  notes: string | null;
  paymentId: string;
}
