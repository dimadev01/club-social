import {
  FileStatus,
  IMemberDetailIAddressDto,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

import { MemberDetailDueDto } from './member-detail-due.dto';

export class MemberDetailDto {
  public address: IMemberDetailIAddressDto | null;
  public birthDate: null | string;
  public category: MemberCategory;
  public documentID: null | string;
  public dues: MemberDetailDueDto[];
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
  public status: UserStatus;
  public userId: string;
}
