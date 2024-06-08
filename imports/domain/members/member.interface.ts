import { IModel } from '@domain/common/models/model.interface';
import { BirthDate } from '@domain/common/value-objects/birth-date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  MemberCategoryEnum,
  MemberCreditTypeEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface IMember extends IModel {
  address: IMemberAddress;
  birthDate: BirthDate | null;
  category: MemberCategoryEnum;
  documentID: string | null;
  fileStatus: MemberFileStatusEnum | null;
  firstName: string;
  lastName: string;
  maritalStatus: MemberMaritalStatusEnum | null;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
  status: MemberStatusEnum;
  userId: string;
}

export interface CreateMember {
  address: CreateMemberAddress;
  birthDate: BirthDate | null;
  category: MemberCategoryEnum;
  documentID: string | null;
  fileStatus: MemberFileStatusEnum | null;
  firstName: string;
  lastName: string;
  maritalStatus: MemberMaritalStatusEnum | null;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
  userId: string;
}

export interface IMemberAddress {
  cityGovId: string | null;
  cityName: string | null;
  stateGovId: string | null;
  stateName: string | null;
  street: string | null;
  zipCode: string | null;
}

export interface CreateMemberAddress {
  cityGovId: string | null;
  cityName: string | null;
  stateGovId: string | null;
  stateName: string | null;
  street: string | null;
  zipCode: string | null;
}

export interface IMemberCredit extends IModel {
  amount: Money;
  dueId: string;
  memberId: string;
  paymentId: string;
  type: MemberCreditTypeEnum;
}

export interface CreateMemberCredit {
  amount: Money;
  dueId: string;
  memberId: string;
  paymentId: string;
  type: MemberCreditTypeEnum;
}
