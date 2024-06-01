import { IEntity } from '@adapters/common/entities/entity.interface';

export interface IPaymentDueEntity extends IEntity {
  amount: number;
  dueId: string;
  paymentId: string;
}
