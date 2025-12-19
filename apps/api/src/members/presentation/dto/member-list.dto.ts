import {
  IMemberPaginatedDto,
  MemberCategory,
} from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

export class MemberPaginatedDto implements IMemberPaginatedDto {
  public category: MemberCategory;
  public id: string;
  public name: string;
  public userStatus: UserStatus;
}
