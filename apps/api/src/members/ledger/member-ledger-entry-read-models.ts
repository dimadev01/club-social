export interface MemberLedgerEntryDetailReadModel {
  amount: number;
  createdAt: Date;
  createdBy: string;
  date: string;
  id: string;
  memberId: string;
  memberName: string;
  notes: null | string;
  paymentId: null | string;
  reversalOfId: null | string;
  source: string;
  status: string;
  type: string;
  updatedAt: Date;
  updatedBy: null | string;
}

export interface MemberLedgerEntryPaginatedExtraModel {
  totalAmount: number;
  totalAmountInflow: number;
  totalAmountOutflow: number;
}

export interface MemberLedgerEntryPaginatedModel {
  amount: number;
  createdAt: Date;
  date: string;
  id: string;
  memberFullName: string;
  memberId: string;
  notes: null | string;
  paymentId: null | string;
  source: string;
  status: string;
  type: string;
}
