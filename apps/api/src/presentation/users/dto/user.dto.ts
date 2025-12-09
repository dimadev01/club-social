import { Role } from '@club-social/types/roles';
import { UserDto } from '@club-social/types/users';

export class UserResponseDto implements UserDto {
  public email: string;
  public firstName: string;
  public id: string;
  public lastName: string;
  public name: string;
  public role: Role;
}
