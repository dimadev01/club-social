import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { Email } from '@/shared/domain/value-objects/email/email.vo';

export interface UpdateMemberProfileProps {
  address: Address | null;
  birthDate: Date | null;
  category: MemberCategory;
  documentID: null | string;
  email: Email;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  maritalStatus: MaritalStatus | null;
  nationality: MemberNationality | null;
  phones: string[];
  sex: MemberSex | null;
  status: UserStatus;
  updatedBy: string;
}
