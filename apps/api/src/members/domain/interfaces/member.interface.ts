import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';

import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { Email } from '@/shared/domain/value-objects/email/email.vo';

export interface UpdateMemberProfileProps {
  address: Address | null;
  birthDate: DateOnly | null;
  category: MemberCategory;
  documentID: null | string;
  email: Email;
  fileStatus: FileStatus;
  maritalStatus: MaritalStatus | null;
  nationality: MemberNationality | null;
  phones: string[];
  sex: MemberSex | null;
  updatedBy: string;
}
