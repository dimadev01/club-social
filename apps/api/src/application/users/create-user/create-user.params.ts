import { Role } from '@club-social/shared/roles';

export interface CreateUserParams {
  createdBy: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
