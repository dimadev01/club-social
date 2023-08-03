import { IPaginatedRepository } from '@application/repositories/repository-paginated.base';
import { IRepository } from '@application/repositories/repository.base';
import { Movement } from '@domain/movements/movement.entity';

export interface IMovementPort
  extends IRepository<Movement>,
    IPaginatedRepository<Movement> {}
