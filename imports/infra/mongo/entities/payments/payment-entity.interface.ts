import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { IEntity } from '@infra/mongo/entities/common/entity.interface';

export interface IPaymentEntity extends IEntity {
  date: Date;
  memberId: string;
  notes: string | null;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
}
