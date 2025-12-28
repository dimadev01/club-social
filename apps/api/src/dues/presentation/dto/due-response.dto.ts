import {
  DueCategory,
  DueDto,
  DueMemberDto,
  DueSettlementDto,
  DueSettlementMemberLedgerEntryDto,
  DueSettlementPaymentDto,
  DueSettlementStatus,
  DueStatus,
} from '@club-social/shared/dues';
import { MemberStatus } from '@club-social/shared/members';

export class DueMemberResponseDto implements DueMemberDto {
  public id: string;
  public name: string;
  public status: MemberStatus;
}

export class DueResponseDto implements DueDto {
  public amount: number;
  public category: DueCategory;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public id: string;
  public member: DueMemberResponseDto;
  public notes: null | string;
  public settlements: DueSettlementDto[];
  public status: DueStatus;
  public updatedAt: string;
  public updatedBy: null | string;
  public voidedAt: null | string;
  public voidedBy: null | string;
  public voidReason: null | string;
}

export class DueSettlementMemberLedgerEntryResponseDto implements DueSettlementMemberLedgerEntryDto {
  public date: string;
  public id: string;
}

export class DueSettlementPaymentResponseDto implements DueSettlementPaymentDto {
  public id: string;
}

export class DueSettlementResponseDto implements DueSettlementDto {
  public amount: number;
  public memberLedgerEntry: DueSettlementMemberLedgerEntryResponseDto;
  public payment: DueSettlementPaymentResponseDto | null;
  public status: DueSettlementStatus;
}
