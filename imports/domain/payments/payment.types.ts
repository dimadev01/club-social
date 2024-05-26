export interface CreatePayment {
  date: string;
  memberId: string;
  notes: string | null;
  receiptNumber: number;
}
