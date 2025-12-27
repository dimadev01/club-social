import { DueSettlementStatus } from '@club-social/shared/dues';
import { IPaymentDueDetailDto } from '@club-social/shared/payment-due';
import { IPaymentDetailDto, PaymentStatus } from '@club-social/shared/payments';
import { UserStatus } from '@club-social/shared/users';

export class PaymentDetailDto implements IPaymentDetailDto {
  public amount: number;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public id: string;
  public memberId: string;
  public memberName: string;
  public notes: null | string;
  public receiptNumber: null | string;
  public status: PaymentStatus;
  public updatedAt: string;
  public updatedBy: string;
  public userStatus: UserStatus;
  public voidedAt: null | string;
  public voidedBy: null | string;
  public voidReason: null | string;
}

export class PaymentDetailDueDto implements IPaymentDueDetailDto {
  public amount: number;
  public dueId: string;
  public paymentId: string;
  public status: DueSettlementStatus;
}
