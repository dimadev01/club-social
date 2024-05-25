import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export class GetMemberResponseDto {
  public _id: string;

  public addressCityGovId: string | null;

  public addressCityName: string | null;

  public addressStateGovId: string | null;

  public addressStateName: string | null;

  public addressStreet: string | null;

  public addressZipCode: string | null;

  public category: MemberCategoryEnum;

  public dateOfBirth: Date | null;

  public documentID: string | null;

  public emails: string[];

  public fileStatus: MemberFileStatusEnum | null;

  public firstName: string;

  public lastName: string;

  public maritalStatus: MemberMaritalStatusEnum | null;

  public name: string;

  public nationality: MemberNationalityEnum | null;

  public phones: string[] | null;

  public sex: MemberSexEnum | null;

  public status: MemberStatusEnum;

  public userId: string;
}
