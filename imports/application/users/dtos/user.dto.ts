import { RoleEnum } from '@domain/roles/role.enum';

export interface UserDto {
  emails: UserEmailDto[];
  firstName: string;
  id: string;
  isActive: boolean;
  lastName: string;
  name: string;
  role: RoleEnum;
}

export interface UserEmailDto {
  address: string;
  verified: boolean;
}
