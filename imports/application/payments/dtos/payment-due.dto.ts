export interface PaymentDueDto {
  creditAmount: number;
  directAmount: number;
  dueAmount: number;
  dueCategory: string;
  dueDate: string;
  dueId: string;
  duePendingAmount: number;
  totalAmount: number;
}
