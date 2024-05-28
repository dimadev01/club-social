import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
} from '@domain/members/member.enum';

export interface CreateMemberRequest {
  addressCityGovId: string | null;
  addressCityName: string | null;
  addressStateGovId: string | null;
  addressStateName: string | null;
  addressStreet: string | null;
  addressZipCode: string | null;
  category: MemberCategoryEnum;
  dateOfBirth: string | null;
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
