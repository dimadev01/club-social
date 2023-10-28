import { IPaginatedRepository } from '@application/repositories/repository-paginated.interface';
import { IRepository } from '@application/repositories/repository.interface';
import { Movement } from '@domain/movements/entities/movement.entity';

export interface IMovementPort
  extends IRepository<Movement>,
    IPaginatedRepository<Movement> {}
