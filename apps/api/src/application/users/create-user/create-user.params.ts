import { UserRole } from '@club-social/types/users';

export interface CreateUserParams {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
