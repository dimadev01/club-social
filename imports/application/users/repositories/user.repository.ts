import { ICrudRepository } from '@application/common/repositories/crud.repository';
import { IGridRepository } from '@application/common/repositories/grid.repository';
import { User } from '@domain/users/models/user.model';

export interface IUserRepository
  extends ICrudRepository<User>,
    IGridRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
