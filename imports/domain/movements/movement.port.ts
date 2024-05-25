import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Movement } from '@domain/movements/entities/movement.entity';
import {
  FindPaginatedMovementsRequest,
  FindPaginatedMovementsResponse,
} from '@infra/mongo/repositories/movements/movement-repository.types';

export interface IMovementPort extends ICrudPort<Movement> {
  findNextToMigrate(id: string): Promise<Movement | null>;
}

export interface IMovementPaginatedPort extends IPaginatedPort<Movement> {
  findPaginated(
    request: FindPaginatedMovementsRequest,
  ): Promise<FindPaginatedMovementsResponse>;
}
