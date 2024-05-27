import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import { UserModel } from '@domain/users/models/user.model';

export type IUserRepository<TSession = unknown> = ICrudRepository<
  UserModel,
  TSession
>;
