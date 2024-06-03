import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { IGridRepository } from '@domain/common/repositories/grid.repository';
import { Due } from '@domain/dues/models/due.model';
import {
  FindPaginatedDuesRequest,
  FindPendingDuesRequest,
} from '@domain/dues/repositories/due-repository.types';

export interface IDueRepository
  extends ICrudRepository<Due>,
    IGridRepository<Due, FindPaginatedDuesRequest> {
  findPending(request: FindPendingDuesRequest): Promise<Due[]>;
}
