import { UserStatus } from '@club-social/shared/users';

import { Email } from '@/shared/domain/value-objects/email/email.vo';

export interface UpdateUserProfileProps {
  email: Email;
  firstName: string;
  lastName: string;
  status: UserStatus;
  updatedBy: string;
}
