import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  IGridRepository,
} from '@domain/common/repositories/grid.repository';
import { Movement } from '@domain/movements/models/movement.model';

export interface IMovementRepository
  extends ICrudRepository<Movement>,
    IGridRepository<Movement, FindPaginatedRequest> {}
