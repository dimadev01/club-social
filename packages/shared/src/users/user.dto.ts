import { UserRole, UserStatus } from './user.enum';

export interface ICreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface IUpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
}

export interface IUserDetailDto {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
}

export interface IUserPaginatedDto {
  email: string;
  id: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}
