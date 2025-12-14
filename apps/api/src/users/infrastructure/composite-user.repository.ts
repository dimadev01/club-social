import { PaginatedRequest, PaginatedResponse } from '@club-social/shared/types';
import { Inject, Injectable } from '@nestjs/common';

import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { UserEntity } from '../domain/entities/user.entity';
import {
  USER_READABLE_REPOSITORY_PROVIDER,
  USER_WRITEABLE_REPOSITORY_PROVIDER,
  type UserReadableRepository,
  UserRepository,
  type UserWriteableRepository,
} from '../domain/user.repository';

@Injectable()
export class CompositeUserRepository implements UserRepository {
  public constructor(
    @Inject(USER_READABLE_REPOSITORY_PROVIDER)
    private readonly userReadableRepository: UserReadableRepository,
    @Inject(USER_WRITEABLE_REPOSITORY_PROVIDER)
    private readonly userWriteableRepository: UserWriteableRepository,
  ) {}

  public async findManyByIds(ids: UniqueId[]): Promise<UserEntity[]> {
    return this.userReadableRepository.findManyByIds(ids);
  }

  public async findOneById(id: UniqueId): Promise<null | UserEntity> {
    return this.userReadableRepository.findOneById(id);
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<UserEntity> {
    return this.userReadableRepository.findOneByIdOrThrow(id);
  }

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<UserEntity>> {
    return this.userReadableRepository.findPaginated(params);
  }

  public async findUniqueByEmail(email: Email): Promise<null | UserEntity> {
    return this.userReadableRepository.findUniqueByEmail(email);
  }

  public async save(entity: UserEntity): Promise<UserEntity> {
    return this.userWriteableRepository.save(entity);
  }
}
