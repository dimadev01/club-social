import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@club-social/shared/members';

export interface MemberAddressReadModel {
  cityName: null | string;
  stateName: null | string;
  street: null | string;
  zipCode: null | string;
}

export interface MemberPaginatedExtraReadModel {
  electricityTotalDueAmount: number;
  guestTotalDueAmount: number;
  memberShipTotalDueAmount: number;
}

export interface MemberPaginatedReadModel {
  category: MemberCategory;
  electricityTotalDueAmount: number;
  email: string;
  guestTotalDueAmount: number;
  id: string;
  memberShipTotalDueAmount: number;
  name: string;
  status: MemberStatus;
}

export interface MemberReadModel {
  address: MemberAddressReadModel | null;
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
  status: MemberStatus;
  userId: string;
}

export interface MemberSearchParams {
  limit: number;
  searchTerm: string;
}

export interface MemberSearchReadModel {
  category: MemberCategory;
  id: string;
  name: string;
  status: MemberStatus;
}
