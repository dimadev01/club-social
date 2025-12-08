import { Inject } from '@nestjs/common';

import type { Result } from '@/domain/shared/result';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { UseCase } from '@/application/shared/use-case';
import { DomainEventPublisher } from '@/domain/shared/events/domain-event-publisher';
import { err, ok } from '@/domain/shared/result';
import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UserEntity } from '@/domain/users/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/domain/users/user.repository';

import type { CreateUserParams } from './create-user.params';

export class CreateUserUseCase extends UseCase<UserEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: CreateUserParams): Promise<Result<UserEntity>> {
    this.logger.info({
      message: 'Creating user',
      params,
    });

    const email = Email.create(params.email);

    if (email.isErr()) {
      return err(email.error);
    }

    const user = UserEntity.create({
      authId: null,
      email: email.value,
      firstName: params.firstName,
      lastName: params.lastName,
      role: params.role,
    });

    if (user.isErr()) {
      return err(user.error);
    }

    await this.userRepository.save(user.value);
    this.eventPublisher.dispatch(user.value);

    return ok(user.value);
  }
}
