import type {
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from './member-ledger.enum';

export interface IMemberLedgerEntryDetailDto {
  amount: number;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  memberFullName: string;
  memberId: string;
  notes: null | string;
  paymentId: null | string;
  reversalOfId: null | string;
  source: MemberLedgerEntrySource;
  status: MemberLedgerEntryStatus;
  type: MemberLedgerEntryType;
  updatedAt: string;
  updatedBy: null | string;
}

export interface IMemberLedgerEntryPaginatedDto {
  amount: number;
  createdAt: string;
  date: string;
  id: string;
  memberFullName: string;
  memberId: string;
  notes: null | string;
  paymentId: null | string;
  source: MemberLedgerEntrySource;
  status: MemberLedgerEntryStatus;
  type: MemberLedgerEntryType;
}

export interface IMemberLedgerEntryPaginatedExtraDto {
  totalAmount: number;
  totalAmountInflow: number;
  totalAmountOutflow: number;
}
