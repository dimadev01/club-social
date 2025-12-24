import {
  IMemberPaginatedDto,
  IMemberPaginatedExtraDto,
  MemberCategory,
} from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

export class MemberPaginatedDto implements IMemberPaginatedDto {
  public category: MemberCategory;
  public electricityTotalDueAmount: number;
  public email: string;
  public guestTotalDueAmount: number;
  public id: string;
  public memberShipTotalDueAmount: number;
  public name: string;
  public userStatus: UserStatus;
}

export class MemberPaginatedExtraDto implements IMemberPaginatedExtraDto {
  public electricityTotalDueAmount: number;
  public guestTotalDueAmount: number;
  public memberShipTotalDueAmount: number;
}
