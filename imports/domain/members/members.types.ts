import {
  MemberCategory,
  MemberFileStatus,
  MemberMaritalStatus,
  MemberNationality,
  MemberSex,
} from '@domain/members/members.enum';

export interface CreateMember {
  category: MemberCategory | null;
  dateOfBirth: string | null;
  documentID: string | null;
  emails: string[] | null;
  fileStatus: MemberFileStatus | null;
  maritalStatus: MemberMaritalStatus | null;
  nationality: MemberNationality | null;
  phones: string[] | null;
  sex: MemberSex | null;
  userId: string;
}
