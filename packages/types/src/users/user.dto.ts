export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  STAFF = 'STAFF',
}

export interface UserDto {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: UserRole;
}