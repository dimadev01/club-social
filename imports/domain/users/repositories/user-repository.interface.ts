import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import { UserModel } from '@domain/users/models/user.model';

export interface IUserRepository<TSession = unknown>
  extends ICrudRepository<UserModel, TSession> {
  findByEmail(email: string): Promise<UserModel | null>;
}
