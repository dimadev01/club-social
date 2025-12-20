import { IPaymentDetailDto, PaymentStatus } from '@club-social/shared/payments';

export class PaymentResponseDto implements IPaymentDetailDto {
  public amount: number;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public dueId: string;
  public id: string;
  public notes: null | string;
  public status: PaymentStatus;
  public updatedAt: string;
  public updatedBy: null | string;
}
