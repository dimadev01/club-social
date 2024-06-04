import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  IGridRepository,
} from '@domain/common/repositories/grid.repository';
import { FindOneModelById } from '@domain/common/repositories/queryable.repository';
import { DueStatusEnum } from '@domain/dues/due.enum';
import { Due } from '@domain/dues/models/due.model';

export interface IDueRepository
  extends ICrudRepository<Due>,
    IGridRepository<Due, FindPaginatedDuesRequest> {
  findOneById(request: FindOneDueById): Promise<Due | null>;
  findOneByIdOrThrow(request: FindOneDueById): Promise<Due>;
  findPending(request: FindPendingDuesRequest): Promise<Due[]>;
}

export interface FindOneDueById extends FindOneModelById {
  fetchMember?: boolean;
  fetchPaymentDues?: boolean;
}

export interface FindPaginatedDuesRequest extends FindPaginatedRequest {
  filterByMember: string[];
  filterByStatus: DueStatusEnum[];
}

export type FindPaginatedDuesResponse<T> = FindPaginatedResponse<T>;

export interface FindPendingDuesRequest {
  memberId: string;
}
