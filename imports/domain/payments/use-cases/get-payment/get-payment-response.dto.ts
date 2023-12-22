import { GetPaymentDueResponseDto } from '@domain/payments/use-cases/get-payment/get-payment-due-response.dto';

export class GetPaymentResponseDto {
  public _id: string;

  public date: string;

  public dues: GetPaymentDueResponseDto[];

  public memberId: string;

  public memberName: string;

  public notes: string | null;
}
