export interface UpdatePaymentParams {
  date: string;
  id: string;
  notes: null | string;
  paymentDues: { amount: number; dueId: string }[];
  updatedBy: string;
}
