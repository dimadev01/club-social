export interface CreatePaymentDto {
  amount: number;
  date: string;
  dueId: string;
  notes: null | string;
}

export interface PaymentDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  dueId: string;
  id: string;
  notes: null | string;
  updatedAt: string;
  updatedBy: null | string;
}

export interface UpdatePaymentDto {
  amount: number;
  date: string;
  notes: null | string;
}
