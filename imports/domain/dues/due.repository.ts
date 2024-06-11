import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  IGridRepository,
} from '@domain/common/repositories/grid.repository';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { Due } from '@domain/dues/models/due.model';

export interface IDueRepository
  extends ICrudRepository<Due>,
    IGridRepository<Due, FindPaginatedDuesRequest> {
  findOneById(request: FindOneById): Promise<Due | null>;
  findOneByIdOrThrow(request: FindOneById): Promise<Due>;
  findPaginated(
    request: FindPaginatedDuesRequest,
  ): Promise<FindPaginatedResponse<Due>>;
  findPending(request: FindPendingDues): Promise<Due[]>;
  findToExport(request: FindPaginatedDuesRequest): Promise<Due[]>;
  getTotals(request: FindPaginatedDuesFilters): Promise<GetDuesTotalsResponse>;
}

export interface FindPaginatedDuesFilters {
  filterByCategory: DueCategoryEnum[];
  filterByCreatedAt: string[];
  filterByDate: string[];
  filterByMember: string[];
  filterByStatus: DueStatusEnum[];
}

export interface FindPaginatedDuesRequest
  extends FindPaginatedDuesFilters,
    FindPaginatedRequest {}

export interface FindPendingDues {
  memberId: string;
}

export interface FindDuesByPayment {
  paymentId: string;
}

export interface GetDuesTotalsResponse {
  pendingAmount: number;
}
