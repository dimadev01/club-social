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
}

export interface FindPaginatedDuesRequest extends FindPaginatedRequest {
  filterByCategory: DueCategoryEnum[];
  filterByMember: string[];
  filterByStatus: DueStatusEnum[];
}

export interface FindPendingDues {
  memberId: string;
}

export interface FindDuesByPayment {
  paymentId: string;
}
