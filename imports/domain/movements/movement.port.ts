import {
  FindPaginatedMovementsRequest,
  FindPaginatedMovementsResponse,
} from '@adapters/repositories/movements/movement-repository.types';
import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Movement } from '@domain/movements/entities/movement.entity';

export type IMovementPort = ICrudPort<Movement>;

export interface IMovementPaginatedPort extends IPaginatedPort<Movement> {
  findPaginated(
    request: FindPaginatedMovementsRequest,
  ): Promise<FindPaginatedMovementsResponse>;
}
