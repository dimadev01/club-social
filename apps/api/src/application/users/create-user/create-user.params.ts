import { UserRole } from '@/domain/users/user.enum';

export interface CreateUserParams {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
