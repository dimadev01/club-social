import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { User } from '@domain/users/models/user.model';

export interface IUserRepository<TSession = unknown>
  extends ICrudRepository<User, TSession> {
  findByEmail(email: string): Promise<User | null>;
}
