import { IModel } from '@domain/common/models/model.interface';
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

export interface IMemberModel extends IModel {
  address: IMemberAddressModel;
  category: MemberCategoryEnum;
  dateOfBirth: Date | null;
  documentID: string | null;
  fileStatus: MemberFileStatusEnum | null;
  maritalStatus: MemberMaritalStatusEnum | null;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
  status: MemberStatusEnum;
  user: UserModel | null;
  userId: string;
}
