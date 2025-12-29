import type {
  MemberLedgerEntryMovementType,
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from './member-ledger.enum';

export interface CreateMemberLedgerEntryDto {
  amount: number;
  date: string;
  memberId: string;
  movementType: MemberLedgerEntryMovementType;
  notes: null | string;
}

export interface MemberLedgerEntryDto {
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
}

export interface MemberLedgerEntryDto {
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

export interface MemberLedgerEntryPaginatedDto {
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

export interface MemberLedgerEntryPaginatedExtraDto {
  balance: number;
}
