import { MemberCategory, MemberStatus } from '@club-social/shared/members';

export interface GroupMemberReadModel {
  category: MemberCategory;
  id: string;
  name: string;
  status: MemberStatus;
}

export interface GroupPaginatedMemberReadModel {
  id: string;
  name: string;
}

export interface GroupPaginatedReadModel {
  id: string;
  members: GroupPaginatedMemberReadModel[];
  name: string;
}

export interface GroupReadModel {
  createdAt: Date;
  createdBy: string;
  id: string;
  members: GroupMemberReadModel[];
  name: string;
  updatedAt: Date;
  updatedBy: null | string;
}
