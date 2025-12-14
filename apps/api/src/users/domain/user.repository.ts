import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { Email } from '@/shared/domain/value-objects/email/email.vo';

import { UserEntity } from './entities/user.entity';

export const USER_REPOSITORY_PROVIDER = Symbol('UserRepository');
export const USER_READABLE_REPOSITORY_PROVIDER = Symbol(
  'UserReadableRepository',
);
export const USER_WRITEABLE_REPOSITORY_PROVIDER = Symbol(
  'UserWriteableRepository',
);

export interface UserReadableRepository
  extends PaginatedRepository<UserEntity>, ReadableRepository<UserEntity> {
  findUniqueByEmail(email: Email): Promise<null | UserEntity>;
}

export interface UserRepository
  extends UserReadableRepository, UserWriteableRepository {}

export type UserWriteableRepository = WriteableRepository<UserEntity>;
