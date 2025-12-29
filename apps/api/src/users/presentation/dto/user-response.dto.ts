import { UserDto, UserRole } from '@club-social/shared/users';
import { UserStatus } from '@club-social/shared/users';

export class UserResponseDto implements UserDto {
  public email: string;
  public firstName: string;
  public id: string;
  public lastName: string;
  public name: string;
  public role: UserRole;
  public status: UserStatus;
}
