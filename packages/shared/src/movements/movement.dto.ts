export interface ICreateMovementDto {
  amount: number;
  category: string;
  date: string;
  description: null | string;
  type: string;
}

export interface IMovementDetailDto {
  amount: number;
  category: string;
  createdAt: string;
  createdBy: string;
  date: string;
  description: null | string;
  id: string;
  paymentId: null | string;
  status: string;
  type: string;
  updatedAt: string;
  updatedBy: string;
  voidedAt: null | string;
  voidedBy: null | string;
  voidReason: null | string;
}

export interface IVoidMovementDto {
  voidReason: string;
}
