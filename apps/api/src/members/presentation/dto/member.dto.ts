import { UserRole } from '@club-social/shared/users';
import { UserDto, UserStatus } from '@club-social/shared/users';

export class MemberResponseDto implements UserDto {
  public email: string;
  public firstName: string;
  public id: string;
  public lastName: string;
  public name: string;
  public role: UserRole;
  public status: UserStatus;
}
