import {
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';
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

  public async findById(id: UniqueId): Promise<null | UserEntity> {
    return this.userReadableRepository.findById(id);
  }

  public async findByIdOrThrow(id: UniqueId): Promise<UserEntity> {
    return this.userReadableRepository.findByIdOrThrow(id);
  }

  public async findByIds(ids: UniqueId[]): Promise<UserEntity[]> {
    return this.userReadableRepository.findByIds(ids);
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<PaginatedDataResultDto<UserEntity>> {
    return this.userReadableRepository.findPaginated(params);
  }

  public async findUniqueByEmail(email: Email): Promise<null | UserEntity> {
    return this.userReadableRepository.findUniqueByEmail(email);
  }

  public async save(entity: UserEntity): Promise<void> {
    await this.userWriteableRepository.save(entity);
  }
}
