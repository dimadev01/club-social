export interface PaymentDueDto {
  creditAmount: number;
  debitAmount: number;
  dueAmount: number;
  dueCategory: string;
  dueDate: string;
  dueId: string;
  duePendingAmount: number;
  totalAmount: number;
}
