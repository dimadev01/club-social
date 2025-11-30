import { UserRole } from '@/domain/users/user.enum';

export class UserDto {
  public email: string;
  public firstName: string;
  public id: string;
  public lastName: string;
  public role: UserRole;
}
