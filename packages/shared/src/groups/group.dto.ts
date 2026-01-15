export interface AddGroupMemberDto {
  memberId: string;
}

export interface CreateGroupDto {
  memberIds: string[];
  name: string;
}

export interface GroupDto {
  createdAt: string;
  createdBy: string;
  id: string;
  members: GroupMemberDto[];
  name: string;
  updatedAt: string;
  updatedBy: null | string;
}

export interface GroupMemberDto {
  id: string;
  name: string;
}

export interface GroupPaginatedDto {
  id: string;
  members: GroupPaginatedMemberDto[];
  name: string;
}

export interface GroupPaginatedMemberDto {
  id: string;
  name: string;
}

export interface RemoveGroupMemberDto {
  memberId: string;
}

export interface UpdateGroupDto {
  name: string;
}
