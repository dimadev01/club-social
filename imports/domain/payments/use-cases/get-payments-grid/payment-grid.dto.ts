import { PaymentDueGridDto } from '@domain/payments/use-cases/get-payments-grid/payment-due-grid.dto';

export class PaymentGridDto {
  _id: string;

  date: string;

  dues: PaymentDueGridDto[];

  duesCount: number;

  duesTotalAmount: string;

  memberId: string;

  memberName: string;
}
