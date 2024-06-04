import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { IGridRepository } from '@domain/common/repositories/grid.repository';
import { FindOneModelById } from '@domain/common/repositories/queryable.repository';
import { Due } from '@domain/dues/models/due.model';
import {
  FindPaginatedDuesRequest,
  FindPendingDuesRequest,
} from '@domain/dues/repositories/due-repository.types';

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
