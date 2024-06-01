import { IEntity } from '@infra/mongo/entities/common/entity.interface';

export interface IPaymentDueEntity extends IEntity {
  amount: number;
  dueId: string;
  paymentId: string;
}
