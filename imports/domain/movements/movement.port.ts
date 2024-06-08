import {
  FindPaginatedMovementsRequest,
  FindPaginatedMovementsResponse,
} from '@adapters/repositories/movements/movement-repository.types';

import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { OldMovement } from '@domain/movements/entities/movement.entity';

export type IMovementPort = ICrudPort<OldMovement>;

export interface IMovementPaginatedPort extends IPaginatedPort<OldMovement> {
  findPaginated(
    request: FindPaginatedMovementsRequest,
  ): Promise<FindPaginatedMovementsResponse>;
}
