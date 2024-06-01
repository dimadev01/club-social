export interface PaymentGridModelDto {
  _id: string;
  date: string;
  isDeleted: boolean;
  isoDate: string;
  memberId: string;
  memberName: string;
  paymentDuesCount: number;
  totalAmount: number;
}
