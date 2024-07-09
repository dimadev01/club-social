import { RoleEnum } from '@domain/roles/role.enum';

export interface UserGridDto {
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  name: string;
  role: RoleEnum;
}
