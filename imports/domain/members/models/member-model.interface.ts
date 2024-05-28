import { IModel } from '@domain/common/models/model.interface';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import {
  CreateMemberAddress,
  IMemberAddressModel,
} from '@domain/members/models/member-address-model.interface';
import { UserModel } from '@domain/users/models/user.model';

export interface CreateMember {
  address: CreateMemberAddress;
  category: MemberCategoryEnum;
  dateOfBirth: string | null;
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
