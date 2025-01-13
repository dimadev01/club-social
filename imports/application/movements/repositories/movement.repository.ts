import { ICrudRepository } from '@application/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  IGridRepository,
} from '@application/common/repositories/grid.repository';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { Movement } from '@domain/movements/models/movement.model';

export interface IMovementRepository
  extends ICrudRepository<Movement>,
    IGridRepository<Movement, FindPaginatedMovementsRequest> {
  findOneByPaymentOrThrow(request: FindOneById): Promise<Movement>;
  findToExport(request: FindPaginatedMovementsRequest): Promise<Movement[]>;
  getTotals(
    request: FindPaginatedMovementsFilters,
  ): Promise<GetMovementsTotalsResponse>;
}

export interface FindPaginatedMovementsFilters {
  filterByCategory: MovementCategoryEnum[];
  filterByCreatedAt: string[];
  filterByDate: string[];
  filterByStatus: MovementStatusEnum[];
  filterByType: MovementTypeEnum[];
}

export interface FindPaginatedMovementsRequest
  extends FindPaginatedMovementsFilters,
    FindPaginatedRequest {}

export interface GetMovementsTotalsResponse {
  expense: number;
  income: number;
  subtotal: number;
  total: number;
}
