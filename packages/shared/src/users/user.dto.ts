import { UserRole, UserStatus } from './user.enum';

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
}

export interface UserDto {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}
