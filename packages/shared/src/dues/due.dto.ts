import {
  MemberCategory,
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
  MemberStatus,
} from '../members';
import { DueSettlementStatus } from './due-settlement.enum';
import { DueCategory, DueCreationMode, DueStatus } from './due.enum';

export interface CreateDueDto {
  amount: number;
  category: DueCategory;
  creationMode: DueCreationMode;
  date: string;
  memberId: string;
  notes: null | string;
}

export interface DueDto {
  amount: number;
  category: DueCategory;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  member: DueMemberDto;
  notes: null | string;
  settlements: DueSettlementDto[];
  status: DueStatus;
  updatedAt: string;
  updatedBy?: null | string;
  voidedAt: null | string;
  voidedBy: null | string;
  voidReason: null | string;
}

export interface DueMemberDto {
  category: MemberCategory;
  id: string;
  name: string;
  status: MemberStatus;
}

export interface DuePaginatedDto {
  amount: number;
  category: DueCategory;
  createdAt: string;
  date: string;
  id: string;
  memberId: string;
  memberName: string;
  memberStatus: MemberStatus;
  status: DueStatus;
}

export interface DuePaginatedExtraDto {
  pendingAmount: number;
}

export interface DuePendingStatisticsDto {
  categories: Record<DueCategory, number>;
  total: number;
}

export interface DueSettlementDto {
  amount: number;
  dueId: string;
  memberLedgerEntry: DueSettlementMemberLedgerEntryDto;
  payment: DueSettlementPaymentDto | null;
  status: DueSettlementStatus;
}

export interface DueSettlementMemberLedgerEntryDto {
  date: string;
  id: string;
  source: MemberLedgerEntrySource;
  status: MemberLedgerEntryStatus;
  type: MemberLedgerEntryType;
}

export interface DueSettlementPaymentDto {
  date: string;
  id: string;
}

export interface PendingDueDto {
  amount: number;
  category: DueCategory;
  date: string;
  id: string;
  status: DueStatus;
}

export interface PreviewBulkDuesDto {
  memberCategory: MemberCategory;
}

export interface PreviewBulkDuesMemberDto {
  amount: number;
  baseAmount: number;
  discountPercent: number;
  isGroupPricing: boolean;
  memberCategory: MemberCategory;
  memberId: string;
  memberName: string;
}

export interface PreviewBulkDuesResultDto {
  members: PreviewBulkDuesMemberDto[];
  summary: PreviewBulkDuesSummaryDto;
}

export interface PreviewBulkDuesSummaryDto {
  totalAmount: number;
  totalMembers: number;
}

export interface UpdateDueDto {
  amount: number;
  notes: null | string;
}

export interface VoidDueDto {
  voidReason: string;
}
