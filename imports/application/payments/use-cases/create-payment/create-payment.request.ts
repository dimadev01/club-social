export interface CreatePaymentRequest {
  date: string;
  dues: CreatePaymentDueRequest[];
  memberId: string;
  notes: string | null;
  receiptNumber: number;
  sendEmail: boolean;
}

export interface CreatePaymentDueRequest {
  creditAmount: number;
  directAmount: number;
  dueId: string;
}
