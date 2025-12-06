export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  STAFF = 'STAFF',
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserDto {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  name: string;
  role: UserRole;
}
