export interface CreatePaymentRequest {
  date: string;
  dues: CreatePaymentDueRequest[];
  memberId: string;
  notes: string | null;
  receiptNumber: number;
}

export interface CreatePaymentDueRequest {
  creditAmount: number;
  directAmount: number;
  dueId: string;
}
