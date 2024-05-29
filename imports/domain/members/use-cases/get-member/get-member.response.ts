import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface GetMemberResponse {
  _id: string;
  addressCityGovId: string | null;
  addressCityName: string | null;
  addressStateGovId: string | null;
  addressStateName: string | null;
  addressStreet: string | null;
  addressZipCode: string | null;
  category: MemberCategoryEnum;
  dateOfBirth: Date | null;
  documentID: string | null;
  emails: string[];
  fileStatus: MemberFileStatusEnum | null;
  firstName: string;
  lastName: string;
  maritalStatus: MemberMaritalStatusEnum | null;
  name: string;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
  status: MemberStatusEnum;
}
