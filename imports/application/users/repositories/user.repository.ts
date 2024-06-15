import { ICrudRepository } from '@application/common/repositories/crud.repository';
import { User } from '@domain/users/models/user.model';

export interface IUserRepository extends ICrudRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
