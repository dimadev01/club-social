import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class GetMemberResponseDto {
  _id: string;

  firstName: string;

  lastName: string;

  emails: string[] | null;

  dateOfBirth: Date | null;

  category: MemberCategoryEnum | null;

  documentID: string | null;

  maritalStatus: MemberMaritalStatusEnum | null;

  fileStatus: MemberFileStatusEnum | null;

  phones: string[] | null;

  sex: MemberSexEnum | null;

  nationality: MemberNationalityEnum | null;

  status: MemberStatusEnum;

  addressStateGovId: string | null;

  addressStateName: string | null;

  addressCityGovId: string | null;

  addressCityName: string | null;

  addressStreet: string | null;

  addressZipCode: string | null;

  userId: string;
}
