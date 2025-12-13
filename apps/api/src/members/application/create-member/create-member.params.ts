import {
  FileStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';

import { Address } from '@/shared/domain/value-objects/address/address.vo';

export interface CreateMemberParams {
  address: Address | null;
  birthDate: Date | null;
  category: MemberCategory;
  createdBy: string;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  nationality: MemberNationality;
  phones: null | string[];
  sex: MemberSex;
}
