import { Inject } from '@nestjs/common';

import type { Result } from '@/domain/shared/result';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { UseCase } from '@/application/shared/use-case';
import { err, ok } from '@/domain/shared/result';
import { UserEntity } from '@/domain/users/user.entity';
import {
  type UserRepository,
  USERS_REPOSITORY_PROVIDER,
} from '@/domain/users/user.repository';

import type { CreateUserParams } from './create-user.params';

export class CreateUserUseCase extends UseCase<UserEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(USERS_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {
    super(logger);
  }

  public async execute(params: CreateUserParams): Promise<Result<UserEntity>> {
    this.logger.info({
      message: 'Creating user',
      params,
    });

    const user = UserEntity.create({
      authId: params.authId,
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
    });

    if (user.isErr()) {
      return err(user.error);
    }

    await this.userRepository.save(user.value);

    return ok(user.value);
  }
}
