import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface GetMemberResponse {
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
  id: string;
  lastName: string;
  maritalStatus: MemberMaritalStatusEnum | null;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
  status: MemberStatusEnum;
}
