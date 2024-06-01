import { IModel } from '@domain/common/models/model.interface';

export interface CreatePaymentDue {
  amount: number;
  dueId: string;
  paymentId: string;
}

export interface IPaymentDueModel extends IModel {
  amount: number;
  dueId: string;
  paymentId: string;
}
