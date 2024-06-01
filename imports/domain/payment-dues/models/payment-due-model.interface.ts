import { IModelProps } from '@domain/common/models/model.interface';

export interface CreatePaymentDue {
  amount: number;
  dueId: string;
  paymentId: string;
}

export interface IPaymentDueProps extends IModelProps {
  amount: number;
  dueId: string;
  paymentId: string;
}
