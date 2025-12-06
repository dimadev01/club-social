import { UserDto } from '@club-social/types/users';

import { UserRole } from '@/domain/users/user.enum';

export class UserResponseDto implements UserDto {
  public email: string;
  public firstName: string;
  public id: string;
  public lastName: string;
  public name: string;
  public role: UserRole;
}
