import { Role } from '@club-social/shared/roles';
import { UserDto } from '@club-social/shared/users';

export class UserResponseDto implements UserDto {
  public email: string;
  public firstName: string;
  public id: string;
  public lastName: string;
  public name: string;
  public role: Role;
}
