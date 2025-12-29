import { UserPaginatedDto, UserRole } from '@club-social/shared/users';
import { UserStatus } from '@club-social/shared/users';

export class UserPaginatedResponseDto implements UserPaginatedDto {
  public email: string;
  public id: string;
  public name: string;
  public role: UserRole;
  public status: UserStatus;
}
