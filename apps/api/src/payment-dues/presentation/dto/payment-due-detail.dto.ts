import {
  IPaymentDueDetailDto,
  PaymentDueStatus,
} from '@club-social/shared/payment-due';

export class PaymentDueDetailDto implements IPaymentDueDetailDto {
  public amount: number;
  public dueId: string;
  public paymentId: string;
  public status: PaymentDueStatus;
}
