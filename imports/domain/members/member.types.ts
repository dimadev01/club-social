import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface CreateMemberRequest {
  addressCityGovId: string | null;
  addressCityName: string | null;
  addressStateGovId: string | null;
  addressStateName: string | null;
  addressStreet: string | null;
  addressZipCode: string | null;
  birthDate: string | null;
  category: MemberCategoryEnum;
  documentID: string | null;
  emails: string[] | null;
  fileStatus: MemberFileStatusEnum | null;
  firstName: string;
  lastName: string;
  maritalStatus: MemberMaritalStatusEnum | null;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
}

export interface UpdateMemberRequest
  extends CreateMemberRequest,
    FindOneModelByIdRequest {
  status: MemberStatusEnum;
}

export type CreateMemberOld = {
  address: CreateMemberAddressOld;
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

export type CreateMemberAddressOld = {
  cityGovId: string | null;
  cityName: string | null;
  stateGovId: string | null;
  stateName: string | null;
  street: string | null;
  zipCode: string | null;
};
