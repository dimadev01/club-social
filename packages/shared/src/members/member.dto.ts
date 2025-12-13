import { UserStatus } from '../users/user.enum';
import {
  FileStatus,
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
  birthDate: Date | null;
  category: MemberCategory;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  nationality: MemberNationality;
  phones: null | string[];
  sex: MemberSex;
}

export interface MemberDto {
  address: AddressDto | null;
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
  userId: string;
}

export interface UpdateMemberDto {
  address: AddressDto | null;
  birthDate: Date | null;
  category: MemberCategory;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  nationality: MemberNationality;
  phones: null | string[];
  sex: MemberSex;
  status: UserStatus;
}
