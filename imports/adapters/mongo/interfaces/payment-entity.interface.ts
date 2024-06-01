import { IEntity } from '@adapters/common/entities/entity.interface';
import { IPaymentDueEntity } from '@adapters/mongo/interfaces/payment-due-entity.interface';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export interface IPaymentEntity extends IEntity {
  date: Date;
  dues: IPaymentDueEntity[] | undefined;
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
}
