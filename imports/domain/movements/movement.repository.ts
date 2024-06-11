import {
  MovementCategoryEnum,
  MovementStatusEnum,
} from '@domain/categories/category.enum';
import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  IGridRepository,
} from '@domain/common/repositories/grid.repository';
import { Movement } from '@domain/movements/models/movement.model';

export interface IMovementRepository
  extends ICrudRepository<Movement>,
    IGridRepository<Movement, FindPaginatedRequest> {
  findPaginated(
    request: FindPaginatedMovementsRequest,
  ): Promise<FindPaginatedResponse<Movement>>;
  findToExport(request: FindPaginatedMovementsRequest): Promise<Movement[]>;
}

export interface FindPaginatedMovementsRequest extends FindPaginatedRequest {
  filterByCategory: MovementCategoryEnum[];
  filterByCreatedAt: string[];
  filterByDate: string[];
  filterByStatus: MovementStatusEnum[];
}
