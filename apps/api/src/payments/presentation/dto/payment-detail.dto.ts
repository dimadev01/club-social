import {
  IPaymentDetailDto,
  IPaymentDueDetailDto,
  PaymentStatus,
} from '@club-social/shared/payments';
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
  public status: PaymentStatus;
  public userStatus: UserStatus;
}

export class PaymentDetailDueDto implements IPaymentDueDetailDto {
  public amount: number;
  public dueId: string;
  public paymentId: string;
}
