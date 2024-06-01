import { IEntity } from '@adapters/common/entities/entity.interface';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export interface IPaymentEntity extends IEntity {
  date: Date;
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
}
