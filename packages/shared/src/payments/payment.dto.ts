import { UserStatus } from '../users';
import { PaymentStatus } from './payment.enum';

export interface ICreatePaymentDto {
  date: string;
  memberId: string;
  notes: null | string;
  paymentDues: IPaymentDueItemDto[];
  receiptNumber: null | string;
}

export interface IPaymentDetailDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  memberId: string;
  memberName: string;
  notes: null | string;
  status: PaymentStatus;
  userStatus: UserStatus;
}

export interface IPaymentDueDetailDto {
  amount: number;
  dueId: string;
  paymentId: string;
}

export interface IPaymentDueItemDto {
  amount: number;
  dueId: string;
}

export interface IPaymentPaginatedDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  memberId: string;
  memberName: string;
  status: PaymentStatus;
}

export interface VoidPaymentDto {
  voidReason: string;
}
