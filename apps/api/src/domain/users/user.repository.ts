import type {
  PaginatedRepository,
  ReadableRepository,
  WritableRepository,
} from '../shared/repository';
import type { Email } from '../shared/value-objects/email/email.vo';
import type { UserEntity } from './user.entity';

export const USER_REPOSITORY_PROVIDER = Symbol('UserRepository');

export interface UserRepository
  extends
    PaginatedRepository<UserEntity>,
    ReadableRepository<UserEntity>,
    WritableRepository<UserEntity> {
  findUniqueByEmail(email: Email): Promise<null | UserEntity>;
}
