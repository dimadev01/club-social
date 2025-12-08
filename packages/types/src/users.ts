export const UserRole = {
  ADMIN: 'admin',
  MEMBER: 'member',
  STAFF: 'staff',
} as const;

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

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
