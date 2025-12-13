import { UserStatus } from '@club-social/shared/users';

export interface UpdateMemberParams {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  status: UserStatus;
  updatedBy: string;
}
