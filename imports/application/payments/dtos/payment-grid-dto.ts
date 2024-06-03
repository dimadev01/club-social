import { DueDto } from '@application/dues/dtos/due.dto';

export interface PaymentGridDto {
  date: string;
  dues: PaymentDueGridDto[];
  id: string;
  isDeleted: boolean;
  memberId: string;
  memberName: string;
  paymentDuesCount: number;
  receiptNumber: number | null;
  totalAmount: number;
}

export interface PaymentDueGridDto {
  _id: string;
  amount: number;
  due: DueDto;
}
