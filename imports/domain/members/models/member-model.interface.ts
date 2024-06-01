import { IModel } from '@domain/common/models/model.interface';
import { BirthDate } from '@domain/common/value-objects/birth-date.value-object';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { UserModel } from '@domain/users/models/user.model';

export interface CreateMember {
  address: CreateMemberAddress;
  birthDate: string | null;
  category: MemberCategoryEnum;
  documentID: string | null;
  fileStatus: MemberFileStatusEnum | null;
  maritalStatus: MemberMaritalStatusEnum | null;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
  userId: string;
}

export interface IMemberModel extends IModel {
  address: IMemberAddressModel;
  birthDate: BirthDate | null;
  category: MemberCategoryEnum;
  documentID: string | null;
  fileStatus: MemberFileStatusEnum | null;
  maritalStatus: MemberMaritalStatusEnum | null;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
  status: MemberStatusEnum;
  user: UserModel | undefined;
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

export interface IMemberAddressModel {
  cityGovId: string | null;
  cityName: string | null;
  stateGovId: string | null;
  stateName: string | null;
  street: string | null;
  zipCode: string | null;
}
