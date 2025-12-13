import {
  AddressDto,
  FileStatus,
  MemberCategory,
  MemberDto,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

export class MemberResponseDto implements MemberDto {
  public address: AddressDto | null;
  public birthDate: Date | null;
  public category: MemberCategory;
  public documentID: null | string;
  public email: string;
  public fileStatus: FileStatus;
  public firstName: string;
  public id: string;
  public lastName: string;
  public nationality: MemberNationality;
  public phones: null | string[];
  public sex: MemberSex;
  public status: UserStatus;
  public userId: string;
}
