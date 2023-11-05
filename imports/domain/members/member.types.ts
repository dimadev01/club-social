import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export type CreateMember = {
  address: CreateMemberAddress;
  category: MemberCategoryEnum;
  dateOfBirth: string | null;
  documentID: string | null;
  fileStatus: MemberFileStatusEnum | null;
  maritalStatus: MemberMaritalStatusEnum | null;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
  status: MemberStatusEnum;
  userId: string;
};

export type CreateMemberAddress = {
  cityGovId: string | null;
  cityName: string | null;
  stateGovId: string | null;
  stateName: string | null;
  street: string | null;
  zipCode: string | null;
};
