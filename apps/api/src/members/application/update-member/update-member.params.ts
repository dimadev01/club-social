import {
  FileStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

import { Address } from '@/shared/domain/value-objects/address/address.vo';

export interface UpdateMemberParams {
  address: Address | null;
  birthDate: Date | null;
  category: MemberCategory;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  id: string;
  lastName: string;
  nationality: MemberNationality;
  phones: null | string[];
  sex: MemberSex;
  status: UserStatus;
  updatedBy: string;
}
