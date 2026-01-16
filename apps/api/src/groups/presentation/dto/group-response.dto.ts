import { GroupDto, GroupMemberDto } from '@club-social/shared/groups';
import { MemberCategory, MemberStatus } from '@club-social/shared/members';

export class GroupMemberResponseDto implements GroupMemberDto {
  public category: MemberCategory;
  public id: string;
  public name: string;
  public status: MemberStatus;
}

export class GroupResponseDto implements GroupDto {
  public createdAt: string;
  public createdBy: string;
  public id: string;
  public members: GroupMemberResponseDto[];
  public name: string;
  public updatedAt: string;
  public updatedBy: null | string;
}
