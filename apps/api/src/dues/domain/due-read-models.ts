import {
  DueCategory,
  DueSettlementStatus,
  DueStatus,
} from '@club-social/shared/dues';
import {
  MemberCategory,
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
  MemberStatus,
} from '@club-social/shared/members';

export interface DuePaginatedExtraReadModel {
  totalAmount: number;
}

export type DuePaginatedReadModel = Pick<
  DueReadModel,
  'amount' | 'category' | 'createdAt' | 'date' | 'id' | 'member' | 'status'
>;

export interface DueReadModel {
  amount: number;
  category: DueCategory;
  createdAt: Date;
  createdBy: string;
  date: string;
  dueSettlements: DueSettlement[];
  id: string;
  member: DueMember;
  notes: null | string;
  status: DueStatus;
  updatedAt: Date;
  updatedBy: null | string;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}

interface DueMember {
  category: MemberCategory;
  id: string;
  name: string;
  status: MemberStatus;
}

interface DueSettlement {
  amount: number;
  dueId: string;
  memberLedgerEntry: DueSettlementMemberLedgerEntry;
  payment: DueSettlementPayment | null;
  status: DueSettlementStatus;
}

interface DueSettlementMemberLedgerEntry {
  date: string;
  id: string;
  source: MemberLedgerEntrySource;
  status: MemberLedgerEntryStatus;
  type: MemberLedgerEntryType;
}

interface DueSettlementPayment {
  date: string;
  id: string;
}
