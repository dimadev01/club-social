import { ICrudRepository } from '@application/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  IGridRepository,
} from '@application/common/repositories/grid.repository';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { Due } from '@domain/dues/models/due.model';
import { MemberStatusEnum } from '@domain/members/member.enum';

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
  filterByMemberStatus: MemberStatusEnum[];
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
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}
