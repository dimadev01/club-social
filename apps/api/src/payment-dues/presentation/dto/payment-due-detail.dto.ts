import {
  DueCategory,
  DueSettlementStatus,
  DueStatus,
} from '@club-social/shared/dues';
import {
  IPaymentDueDetailDto,
  IPaymentDueDetailWithDueDto,
  IPaymentDueDetailWithPaymentDto,
} from '@club-social/shared/payment-due';
import { PaymentStatus } from '@club-social/shared/payments';

export class PaymentDueDetailDto implements IPaymentDueDetailDto {
  public amount: number;
  public dueId: string;
  public paymentId: string;
  public status: DueSettlementStatus;
}

export class PaymentDueDetailWithDueDto implements IPaymentDueDetailWithDueDto {
  public amount: number;
  public dueAmount: number;
  public dueCategory: DueCategory;
  public dueDate: string;
  public dueId: string;
  public dueStatus: DueStatus;
  public paymentId: null | string;
  public status: DueSettlementStatus;
}

export class PaymentDueDetailWithPaymentDto implements IPaymentDueDetailWithPaymentDto {
  public amount: number;
  public dueId: string;
  public paymentAmount: number;
  public paymentDate: string;
  public paymentId: null | string;
  public paymentReceiptNumber: null | string;
  public paymentStatus: PaymentStatus;
  public status: DueSettlementStatus;
}
