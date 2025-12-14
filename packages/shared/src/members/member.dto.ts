import { UserStatus } from '../users/user.enum';
import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from './member.enum';

export interface AddressDto {
  cityName: null | string;
  stateName: null | string;
  street: null | string;
  zipCode: null | string;
}

export interface CreateMemberDto {
  address: AddressDto | null;
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

export interface MemberDto {
  address: AddressDto | null;
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

export interface UpdateMemberDto {
  address: AddressDto | null;
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
  status: UserStatus;
}
