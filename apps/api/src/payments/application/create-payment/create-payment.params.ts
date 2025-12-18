export interface CreatePaymentParams {
  amount: number;
  createdBy: string;
  date: string;
  dueId: string;
  notes: null | string;
}
