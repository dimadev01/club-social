import { UserDto } from '@club-social/types/users';

import { UserRole } from '@/domain/users/user.enum';

export class UserResponseDto implements UserDto {
  public email: string;
  public firstName: string;
  public id: string;
  public lastName: string;
  public role: UserRole;
}
