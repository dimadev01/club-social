import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Movement } from '@domain/movements/entities/movement.entity';

export interface IMovementPort
  extends ICrudPort<Movement>,
    IPaginatedPort<Movement> {}
