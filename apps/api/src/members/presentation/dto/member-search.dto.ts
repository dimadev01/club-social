import {
  IMemberSearchResultDto,
  MemberCategory,
} from '@club-social/shared/members';
import { UserStatus } from '@club-social/shared/users';

export class MemberSearchDto implements IMemberSearchResultDto {
  public category: MemberCategory;
  public id: string;
  public name: string;
  public status: UserStatus;
}
