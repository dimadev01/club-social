import { FindPaginatedRequest } from '@application/pagination/find-paginated.request';

export type FindPaginatedDuesRequest = FindPaginatedRequest & {
  from: string | null;
  memberIds: string[];
  showDeleted: boolean | null;
  sortField: 'createdAt';
  to: string | null;
};

export type FindPaidRequest = {
  memberId?: string;
};

export type FindPendingRequest = {
  memberIds: string[];
};

export type FindByIdsRequest = {
  dueIds: string[];
};
