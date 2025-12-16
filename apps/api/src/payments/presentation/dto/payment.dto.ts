import { PaymentDto } from '@club-social/shared/payments';

export class PaymentResponseDto implements PaymentDto {
  public amount: number;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public dueId: string;
  public id: string;
  public notes: null | string;
  public updatedAt: string;
  public updatedBy: null | string;
}
