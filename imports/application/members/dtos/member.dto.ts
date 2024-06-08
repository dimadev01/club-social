import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface MemberDto {
  addressCityGovId: string | null;
  addressCityName: string | null;
  addressStateGovId: string | null;
  addressStateName: string | null;
  addressStreet: string | null;
  addressZipCode: string | null;
  birthDate: string | null;
  category: MemberCategoryEnum;
  documentID: string | null;
  emails: string[];
  fileStatus: MemberFileStatusEnum | null;
  firstName: string;
  id: string;
  lastName: string;
  maritalStatus: MemberMaritalStatusEnum | null;
  name: string;
  nationality: MemberNationalityEnum | null;
  phones: string[] | null;
  sex: MemberSexEnum | null;
  status: MemberStatusEnum;
}
