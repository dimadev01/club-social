import {
  DueCategory,
  DueStatus,
  IDueDetailDto,
} from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

export class DueDetailDto implements IDueDetailDto {
  public amount: number;
  public category: DueCategory;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public id: string;
  public memberCategory: MemberCategory;
  public memberId: string;
  public memberName: string;
  public notes: null | string;
  public status: DueStatus;
  public updatedAt: string;
  public updatedBy?: null | string;
  public userStatus: UserStatus;
  public voidedAt: null | string;
  public voidedBy: null | string;
  public voidReason: null | string;
}
