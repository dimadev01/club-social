import { UserStatus } from '@club-social/shared/users';

import { Email } from '@/shared/domain/value-objects/email/email.vo';

export interface MemberInterface {
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

export interface UpdateMemberProfileProps {
  email: Email;
  firstName: string;
  lastName: string;
  status: UserStatus;
  updatedBy: string;
}
