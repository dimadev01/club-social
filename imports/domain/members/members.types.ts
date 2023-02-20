import {
  MemberCategory,
  MemberFileStatus,
  MemberMaritalStatus,
  MemberNationality,
  MemberSex,
} from '@domain/members/members.enum';

export interface CreateMember {
  address: CreateMemberAddress;
  category: MemberCategory | null;
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
