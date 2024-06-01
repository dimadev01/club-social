import { Due } from '@domain/dues/entities/due.entity';
import { IEntity } from '@infra/mongo/entities/common/entity.interface';

export interface IPaymentDueEntity extends IEntity {
  amount: number;
  due: Due | undefined;
  dueId: string;
  paymentId: string;
}
