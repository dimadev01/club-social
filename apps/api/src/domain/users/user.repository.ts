import {
  PaginatedRepository,
  ReadableRepository,
  WritableRepository,
} from '../shared/base.repository';
import { Email } from '../shared/value-objects/email/email.vo';
import { UserEntity } from './user.entity';

export const USERS_REPOSITORY_PROVIDER = Symbol('UsersRepository');

export interface UserRepository
  extends PaginatedRepository<UserEntity>,
    ReadableRepository<UserEntity>,
    WritableRepository<UserEntity> {
  findUniqueByEmail(email: Email): Promise<null | UserEntity>;
}
