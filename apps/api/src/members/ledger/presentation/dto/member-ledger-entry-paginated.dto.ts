import {
  MemberLedgerEntryPaginatedDto,
  MemberLedgerEntryPaginatedExtraDto,
  type MemberLedgerEntrySource,
  type MemberLedgerEntryStatus,
  type MemberLedgerEntryType,
} from '@club-social/shared/members';

export class MemberLedgerEntryPaginatedExtraResponseDto implements MemberLedgerEntryPaginatedExtraDto {
  public balance: number;
}

export class MemberLedgerEntryPaginatedResponseDto implements MemberLedgerEntryPaginatedDto {
  public amount: number;
  public createdAt: string;
  public date: string;
  public id: string;
  public memberFullName: string;
  public memberId: string;
  public notes: null | string;
  public paymentId: null | string;
  public source: MemberLedgerEntrySource;
  public status: MemberLedgerEntryStatus;
  public type: MemberLedgerEntryType;
}
