import {
  MemberCategory,
  MemberSearchResultDto,
  MemberStatus,
} from '@club-social/shared/members';

export class MemberSearchResponseDto implements MemberSearchResultDto {
  public category: MemberCategory;
  public id: string;
  public name: string;
  public status: MemberStatus;
}
