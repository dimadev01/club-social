import {
  DueCategory,
  DueSettlementStatus,
  DueStatus,
} from '@club-social/shared/dues';
import { MemberStatus } from '@club-social/shared/members';

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
  id: string;
  member: DueMember;
  notes: null | string;
  settlements: DueSettlement[];
  status: DueStatus;
  updatedAt: Date;
  updatedBy: null | string;
  voidedAt: Date | null;
  voidedBy: null | string;
  voidReason: null | string;
}

interface DueMember {
  id: string;
  name: string;
  status: MemberStatus;
}

interface DueSettlement {
  amount: number;
  memberLedgerEntry: DueSettlementMemberLedgerEntry;
  payment: DueSettlementPayment | null;
  status: DueSettlementStatus;
}

interface DueSettlementMemberLedgerEntry {
  date: string;
  id: string;
}

interface DueSettlementPayment {
  id: string;
}
