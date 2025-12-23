import { DueCategory, DueStatus } from '@club-social/shared/dues';
import {
  IPaymentDueDetailDto,
  IPaymentDueDetailWithDueDto,
  IPaymentDueDetailWithPaymentDto,
  PaymentDueStatus,
} from '@club-social/shared/payment-due';
import { PaymentStatus } from '@club-social/shared/payments';

export class PaymentDueDetailDto implements IPaymentDueDetailDto {
  public amount: number;
  public dueId: string;
  public paymentId: string;
  public status: PaymentDueStatus;
}

export class PaymentDueDetailWithDueDto implements IPaymentDueDetailWithDueDto {
  public amount: number;
  public dueAmount: number;
  public dueCategory: DueCategory;
  public dueDate: string;
  public dueId: string;
  public dueStatus: DueStatus;
  public paymentId: string;
  public status: PaymentDueStatus;
}

export class PaymentDueDetailWithPaymentDto implements IPaymentDueDetailWithPaymentDto {
  public amount: number;
  public dueId: string;
  public paymentAmount: number;
  public paymentDate: string;
  public paymentId: string;
  public paymentReceiptNumber: null | string;
  public paymentStatus: PaymentStatus;
  public status: PaymentDueStatus;
}
