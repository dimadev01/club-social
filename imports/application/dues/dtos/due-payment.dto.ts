import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export interface DuePaymentDto {
  amount: number;
  date: string;
  paymentId: string;
  receiptNumber: number | null;
  status: PaymentStatusEnum;
}
