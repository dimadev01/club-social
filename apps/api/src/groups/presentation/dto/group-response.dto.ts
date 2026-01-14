import { GroupDto, GroupMemberDto } from '@club-social/shared/groups';

export class GroupMemberResponseDto implements GroupMemberDto {
  public id: string;
  public name: string;
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
