import {
  MemberCategory,
  MemberFileStatus,
  MemberMaritalStatus,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@domain/members/member.enum';

export interface CreateMember {
  address: CreateMemberAddress;
  category: MemberCategory;
  dateOfBirth: string | null;
  documentID: string | null;
  emails: string[] | null;
  fileStatus: MemberFileStatus | null;
  firstName: string;
  lastName: string;
  maritalStatus: MemberMaritalStatus | null;
  nationality: MemberNationality | null;
  phones: string[] | null;
  sex: MemberSex | null;
  status: MemberStatus;
  userId: string;
}

export interface CreateMemberAddress {
  cityGovId: string | null;
  cityName: string | null;
  stateGovId: string | null;
  stateName: string | null;
  street: string | null;
  zipCode: string | null;
}
