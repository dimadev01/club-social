import { PaymentDueGridDto } from '@domain/payments/use-cases/get-payments-grid/payment-due-grid.dto';

export class PaymentGridDto {
  public _id: string;

  public date: string;

  public dues: PaymentDueGridDto[];

  public count: number;

  public totalAmount: string;

  public isDeleted: boolean;

  public memberId: string;

  public receiptNumber: number | null;

  public memberName: string;
}
