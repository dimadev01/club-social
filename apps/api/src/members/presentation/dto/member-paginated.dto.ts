import {
  MemberCategory,
  MemberPaginatedDto,
  MemberPaginatedExtraDto,
  MemberStatus,
} from '@club-social/shared/members';

export class MemberPaginatedExtraResponseDto implements MemberPaginatedExtraDto {
  public electricityTotalDueAmount: number;
  public guestTotalDueAmount: number;
  public memberShipTotalDueAmount: number;
}

export class MemberPaginatedResponseDto implements MemberPaginatedDto {
  public category: MemberCategory;
  public electricityTotalDueAmount: number;
  public email: string;
  public guestTotalDueAmount: number;
  public id: string;
  public memberShipTotalDueAmount: number;
  public name: string;
  public status: MemberStatus;
}
