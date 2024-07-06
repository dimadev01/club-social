import { RoleEnum } from '@domain/roles/role.enum';

export interface UserDto {
  emails: UserEmailDto[];
  firstName: string;
  id: string;
  lastName: string;
  name: string;
  role: RoleEnum;
}

export interface UserEmailDto {
  address: string;
  verified: boolean;
}
