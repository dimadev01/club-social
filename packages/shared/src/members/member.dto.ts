import { UserStatus } from '../users/user.enum';
import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from './member.enum';

export interface ICreateMemberDto {
  address: IMemberDetailIAddressDto | null;
  birthDate: null | string;
  category: MemberCategory;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  maritalStatus: MaritalStatus | null;
  nationality: MemberNationality | null;
  phones: string[];
  sex: MemberSex | null;
}

export interface IMemberDetailDto {
  address: IMemberDetailIAddressDto | null;
  birthDate: null | string;
  category: MemberCategory;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  id: string;
  lastName: string;
  maritalStatus: MaritalStatus | null;
  name: string;
  nationality: MemberNationality | null;
  phones: string[];
  sex: MemberSex | null;
  status: UserStatus;
  userId: string;
}

export interface IMemberDetailIAddressDto {
  cityName: null | string;
  stateName: null | string;
  street: null | string;
  zipCode: null | string;
}

export interface IMemberPaginatedDto {
  category: MemberCategory;
  electricityTotalDueAmount: number;
  email: string;
  guestTotalDueAmount: number;
  id: string;
  memberShipTotalDueAmount: number;
  name: string;
  userStatus: UserStatus;
}

export interface IMemberPaginatedExtraDto {
  electricityTotalDueAmount: number;
  guestTotalDueAmount: number;
  memberShipTotalDueAmount: number;
}

export interface IMemberSearchResultDto {
  category: MemberCategory;
  id: string;
  name: string;
  status: MemberStatus;
}

export interface IUpdateMemberDto {
  address: IMemberDetailIAddressDto | null;
  birthDate: null | string;
  category: MemberCategory;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  maritalStatus: MaritalStatus | null;
  nationality: MemberNationality | null;
  phones: string[];
  sex: MemberSex | null;
  status: MemberStatus;
}
