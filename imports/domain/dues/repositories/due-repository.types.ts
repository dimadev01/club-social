import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';
import { DueStatusEnum } from '@domain/dues/due.enum';

export interface FindPaginatedDuesRequest extends FindPaginatedRequest {
  filterByMember?: string[];
  filterByStatus?: DueStatusEnum[];
}

export type FindPaginatedDuesResponse<T> = FindPaginatedResponse<T>;

export interface FindPendingDuesRequest {
  memberId: string;
}
