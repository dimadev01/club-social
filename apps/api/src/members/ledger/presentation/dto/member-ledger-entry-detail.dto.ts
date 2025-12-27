import {
  type IMemberLedgerEntryDetailDto,
  type MemberLedgerEntrySource,
  type MemberLedgerEntryStatus,
  type MemberLedgerEntryType,
} from '@club-social/shared/members';

export class MemberLedgerEntryDetailDto implements IMemberLedgerEntryDetailDto {
  public amount: number;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public id: string;
  public memberFullName: string;
  public memberId: string;
  public notes: null | string;
  public paymentId: null | string;
  public reversalOfId: null | string;
  public source: MemberLedgerEntrySource;
  public status: MemberLedgerEntryStatus;
  public type: MemberLedgerEntryType;
  public updatedAt: string;
  public updatedBy: null | string;
}
