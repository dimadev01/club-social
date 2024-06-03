import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { IGridRepository } from '@domain/common/repositories/grid.repository';
import { Due } from '@domain/dues/models/due.model';
import { FindPaginatedDuesRequest } from '@domain/dues/repositories/due-repository.types';

export interface IDueRepository<TSession = unknown>
  extends ICrudRepository<Due, TSession>,
    IGridRepository<Due, FindPaginatedDuesRequest> {}
