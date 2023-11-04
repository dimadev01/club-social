import {
  MemberCategory,
  MemberFileStatus,
  MemberMaritalStatus,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@domain/members/member.enum';

export class GetMemberResponseDto {
  _id: string;

  firstName: string;

  lastName: string;

  emails: string[] | null;

  dateOfBirth: Date | null;

  category: MemberCategory | null;

  documentID: string | null;

  maritalStatus: MemberMaritalStatus | null;

  fileStatus: MemberFileStatus | null;

  phones: string[] | null;

  sex: MemberSex | null;

  nationality: MemberNationality | null;

  status: MemberStatus;

  addressStateGovId: string | null;

  addressStateName: string | null;

  addressCityGovId: string | null;

  addressCityName: string | null;

  addressStreet: string | null;

  addressZipCode: string | null;

  userId: string;
}
