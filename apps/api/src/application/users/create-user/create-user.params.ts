import { Role } from '@club-social/types/roles';

export interface CreateUserParams {
  createdBy: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
