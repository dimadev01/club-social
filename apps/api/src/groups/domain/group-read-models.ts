export interface GroupMemberReadModel {
  id: string;
  name: string;
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
