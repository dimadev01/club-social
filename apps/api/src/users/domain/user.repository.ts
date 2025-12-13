import {
  PaginatedRepository,
  ReadableRepository,
} from '@/shared/domain/repository';
import { Email } from '@/shared/domain/value-objects/email/email.vo';

import { UserEntity } from './entities/user.entity';

export const USER_REPOSITORY_PROVIDER = Symbol('UserRepository');

export interface UserRepository
  extends PaginatedRepository<UserEntity>, ReadableRepository<UserEntity> {
  findUniqueByEmail(email: Email): Promise<null | UserEntity>;
}
