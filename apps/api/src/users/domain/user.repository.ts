import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { Email } from '@/shared/domain/value-objects/email/email.vo';

import { UserEntity } from './entities/user.entity';

export const USER_REPOSITORY_PROVIDER = Symbol('UserRepository');

export interface UserReadableRepository
  extends PaginatedRepository<UserEntity>, ReadableRepository<UserEntity> {
  findUniqueByEmail(email: Email): Promise<null | UserEntity>;
  findUniqueByEmailOrThrow(email: Email): Promise<UserEntity>;
  findWithNotifyOnDueCreated(): Promise<UserEntity[]>;
  findWithNotifyOnMemberCreated(): Promise<UserEntity[]>;
  findWithNotifyOnMovementCreated(): Promise<UserEntity[]>;
  findWithNotifyOnMovementVoided(): Promise<UserEntity[]>;
  findWithNotifyOnPaymentMade(): Promise<UserEntity[]>;
}

export interface UserRepository
  extends
    PaginatedRepository<UserEntity>,
    UserReadableRepository,
    UserWriteableRepository {}

export type UserWriteableRepository = WriteableRepository<UserEntity>;
