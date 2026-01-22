import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from './member.enum';

export interface CreateMemberDto {
  address: MemberAddressDto | null;
  birthDate: string;
  category: MemberCategory;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  maritalStatus: MaritalStatus | null;
  nationality: MemberNationality | null;
  notificationPreferences: MemberNotificationPreferencesDto;
  phones: string[];
  sex: MemberSex;
}

export interface MemberAddressDto {
  cityName: null | string;
  stateName: null | string;
  street: null | string;
  zipCode: null | string;
}

export interface MemberDto {
  address: MemberAddressDto | null;
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
  notificationPreferences: MemberNotificationPreferencesDto;
  phones: string[];
  sex: MemberSex | null;
  status: MemberStatus;
  userId: string;
}

export interface MemberNotificationPreferencesDto {
  notifyOnDueCreated: boolean;
  notifyOnPaymentCreated: boolean;
}

export interface MemberPaginatedDto {
  balance: number;
  category: MemberCategory;
  electricityTotalDueAmount: number;
  email: string;
  guestTotalDueAmount: number;
  id: string;
  memberShipTotalDueAmount: number;
  name: string;
  status: MemberStatus;
  totalAmount: number;
}

export interface MemberPaginatedExtraDto {
  electricityTotalDueAmount: number;
  guestTotalDueAmount: number;
  memberShipTotalDueAmount: number;
  totalAmount: number;
}

export interface MemberSearchResultDto {
  category: MemberCategory;
  id: string;
  name: string;
  status: MemberStatus;
}

export interface UpdateMemberDto {
  address: MemberAddressDto | null;
  birthDate: string;
  category: MemberCategory;
  documentID: null | string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  maritalStatus: MaritalStatus | null;
  nationality: MemberNationality | null;
  notificationPreferences?: MemberNotificationPreferencesDto;
  phones: string[];
  sex: MemberSex;
  status: MemberStatus;
}

export interface UpdateMemberNotificationPreferencesDto {
  notifyOnDueCreated?: boolean;
  notifyOnPaymentCreated?: boolean;
}
