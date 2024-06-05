import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  IGridRepository,
} from '@domain/common/repositories/grid.repository';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { DueStatusEnum } from '@domain/dues/due.enum';
import { Due } from '@domain/dues/models/due.model';

export interface IDueRepository
  extends ICrudRepository<Due>,
    IGridRepository<Due, FindPaginatedDuesRequest> {
  findByPayment(request: FindDuesByPayment): Promise<Due[]>;
  findOneById(request: FindOneDueById): Promise<Due | null>;
  findOneByIdOrThrow(request: FindOneDueById): Promise<Due>;
  findPending(request: FindPendingDues): Promise<Due[]>;
}

export interface FindOneDueById extends FindOneById {
  fetchMember?: boolean;
  fetchPaymentDues?: boolean;
}

export interface FindPaginatedDuesRequest extends FindPaginatedRequest {
  filterByMember: string[];
  filterByStatus: DueStatusEnum[];
}

export interface FindPendingDues {
  memberId: string;
}

export interface FindDuesByPayment {
  paymentId: string;
}
