import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import { UserModel } from '@domain/members/new/user.business';

export type IUserRepository<TSession = unknown> = ICrudRepository<
  UserModel,
  TSession
>;
