import {
  IPaymentPaginatedDto,
  IPaymentPaginatedExtraDto,
  PaymentStatus,
} from '@club-social/shared/payments';

export class PaymentPaginatedDto implements IPaymentPaginatedDto {
  public amount: number;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public id: string;
  public memberId: string;
  public memberName: string;
  public status: PaymentStatus;
}

export class PaymentPaginatedExtraDto implements IPaymentPaginatedExtraDto {
  public totalAmount: number;
}
