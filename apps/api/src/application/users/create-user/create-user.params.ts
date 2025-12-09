import { UserRole } from '@club-social/types/users';

export interface CreateUserParams {
  createdBy: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
