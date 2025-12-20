export interface CreatePaymentParams {
  createdBy: string;
  date: string;
  notes: null | string;
  paymentDues: { amount: number; dueId: string }[];
}
