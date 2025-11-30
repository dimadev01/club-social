import type { Email } from '@/domain/shared/value-objects/email/email.vo';

import { UserRole } from '@/domain/users/user.enum';

export interface CreateUserParams {
  authId: string;
  email: Email;
  firstName: string;
  lastName: string;
  role: UserRole;
}
