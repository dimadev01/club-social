import { UserStatus } from '@club-social/shared/users';

import { Email } from '@/shared/domain/value-objects/email/email.vo';

export interface UpdateUserProfileProps {
  email: Email;
  firstName: string;
  lastName: string;
  status: UserStatus;
  updatedBy: string;
}

export interface UserInterface {
  authId: string;
  createdAt: Date;
  createdBy: string;
  deletedAt: Date | null;
  deletedBy: null | string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  updatedAt: Date;
  updatedBy: string;
}
