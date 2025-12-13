import { UserRole } from '@club-social/shared/users';

export interface CreateMemberParams {
  createdBy: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
