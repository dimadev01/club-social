import { ICrudPort } from '@application/repositories/crud.port';
import { IPaginatedRepository } from '@application/repositories/repository-paginated.interface';
import { Movement } from '@domain/movements/entities/movement.entity';

export interface IMovementPort
  extends ICrudPort<Movement>,
    IPaginatedRepository<Movement> {}
