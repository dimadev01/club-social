import {
  DueCategory,
  DuePaginatedDto,
  DuePaginatedExtraDto,
  DueStatus,
} from '@club-social/shared/dues';
import { MemberStatus } from '@club-social/shared/members';

export class DuePaginatedExtraResponseDto implements DuePaginatedExtraDto {
  public totalAmount: number;
}

export class DuePaginatedResponseDto implements DuePaginatedDto {
  public amount: number;
  public category: DueCategory;
  public createdAt: string;
  public date: string;
  public id: string;
  public memberId: string;
  public memberName: string;
  public memberStatus: MemberStatus;
  public status: DueStatus;
}
