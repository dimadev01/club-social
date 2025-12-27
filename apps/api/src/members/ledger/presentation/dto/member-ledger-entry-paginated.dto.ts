import {
  type IMemberLedgerEntryPaginatedDto,
  type IMemberLedgerEntryPaginatedExtraDto,
  type MemberLedgerEntrySource,
  type MemberLedgerEntryStatus,
  type MemberLedgerEntryType,
} from '@club-social/shared/members';

export class MemberLedgerEntryPaginatedDto implements IMemberLedgerEntryPaginatedDto {
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

export class MemberLedgerEntryPaginatedExtraDto implements IMemberLedgerEntryPaginatedExtraDto {
  public totalAmount: number;
  public totalAmountInflow: number;
  public totalAmountOutflow: number;
}
