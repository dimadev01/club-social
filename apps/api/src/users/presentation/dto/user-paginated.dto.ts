import { IUserPaginatedDto, UserRole } from '@club-social/shared/users';
import { UserStatus } from '@club-social/shared/users';

export class UserPaginatedDto implements IUserPaginatedDto {
  public email: string;
  public id: string;
  public name: string;
  public role: UserRole;
  public status: UserStatus;
}
