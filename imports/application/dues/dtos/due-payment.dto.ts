import { PaymentStatusEnum } from '@domain/payments/payment.enum';

export interface DuePaymentDto {
  creditAmount: number;
  debitAmount: number;
  paymentDate: string;
  paymentId: string;
  paymentReceiptNumber: number | null;
  paymentStatus: PaymentStatusEnum;
  totalAmount: number;
}
