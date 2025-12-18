import { MemberCategory } from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

export class MemberPaginatedDto {
  public category: MemberCategory;
  public email: string;
  public id: string;
  public name: string;
  public status: UserStatus;
}
