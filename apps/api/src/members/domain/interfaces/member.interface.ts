import {
  FileStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { Email } from '@/shared/domain/value-objects/email/email.vo';

export interface MemberInterface {
  address: Address | null;
  birthDate: Date | null;
  category: MemberCategory;
  createdAt: Date;
  createdBy: string;
  deletedAt: Date | null;
  deletedBy: null | string;
  documentID: null | string;
  fileStatus: FileStatus;
  id: string;
  nationality: MemberNationality;
  phones: null | string[];
  sex: MemberSex;
  updatedAt: Date;
  updatedBy: string;
  userId: string;
}

export interface UpdateMemberProfileProps {
  address: Address | null;
  birthDate: Date | null;
  category: MemberCategory;
  documentID: null | string;
  email: Email;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  nationality: MemberNationality;
  phones: null | string[];
  sex: MemberSex;
  status: UserStatus;
  updatedBy: string;
}
