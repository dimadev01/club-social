import {
  AddressDto,
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberDto,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

export class MemberResponseDto implements MemberDto {
  public address: AddressDto | null;
  public birthDate: null | string;
  public category: MemberCategory;
  public documentID: null | string;
  public email: string;
  public fileStatus: FileStatus;
  public firstName: string;
  public id: string;
  public lastName: string;
  public maritalStatus: MaritalStatus | null;
  public nationality: MemberNationality | null;
  public phones: string[];
  public sex: MemberSex | null;
  public status: UserStatus;
  public userId: string;
}
