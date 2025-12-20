import {
  IPaymentDetailDto,
  IPaymentDueDetailDto,
  PaymentStatus,
} from '@club-social/shared/payments';

export class PaymentDetailDto implements IPaymentDetailDto {
  public amount: number;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public id: string;
  public notes: null | string;
  public paymentDues: PaymentDetailDueDto[];
  public status: PaymentStatus;
}

export class PaymentDetailDueDto implements IPaymentDueDetailDto {
  public amount: number;
  public dueId: string;
  public paymentId: string;
}
