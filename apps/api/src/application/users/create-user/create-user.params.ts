import { UserRole } from '@club-social/shared/users';

export interface CreateUserParams {
  createdBy: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
