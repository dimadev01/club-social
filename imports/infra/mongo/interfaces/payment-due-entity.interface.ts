import { IEntity } from '@infra/mongo/interfaces/entity.interface';

export interface IPaymentDueEntity extends IEntity {
  amount: number;
  dueId: string;
  paymentId: string;
}
