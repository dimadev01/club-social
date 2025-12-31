import {
  FileStatus,
  MaritalStatus,
  MemberAddressDto,
  MemberCategory,
  MemberDto,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@club-social/shared/members';

export class MemberResponseDto implements MemberDto {
  public address: MemberAddressDto | null;
  public birthDate: null | string;
  public category: MemberCategory;
  public documentID: null | string;
  public email: string;
  public fileStatus: FileStatus;
  public firstName: string;
  public id: string;
  public lastName: string;
  public maritalStatus: MaritalStatus | null;
  public name: string;
  public nationality: MemberNationality | null;
  public phones: string[];
  public sex: MemberSex | null;
  public status: MemberStatus;
  public userId: string;
}
