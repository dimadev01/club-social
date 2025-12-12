import { Inject } from '@nestjs/common';

import type { Result } from '@/domain/shared/result';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { UseCase } from '@/application/shared/use-case';
import { ConflictError } from '@/domain/shared/errors/conflict.error';
import { DomainEventPublisher } from '@/domain/shared/events/domain-event-publisher';
import { err, ok } from '@/domain/shared/result';
import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/domain/users/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/domain/users/user.repository';

import { UpdateUserParams } from './update-user.params';

export class UpdateUserUseCase extends UseCase<UserEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: UpdateUserParams): Promise<Result<UserEntity>> {
    this.logger.info({
      message: 'Updating user',
      params,
    });

    const email = Email.create(params.email);

    if (email.isErr()) {
      return err(email.error);
    }

    const existingUserByEmail = await this.userRepository.findUniqueByEmail(
      email.value,
    );

    if (existingUserByEmail && existingUserByEmail.id.value !== params.id) {
      return err(new ConflictError('El email ya está en uso'));
    }

    const user = await this.userRepository.findOneByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    // user.updateName(params.firstName, params.lastName);
    // user.updateEmail(email.value);
    // user.updateStatus(params.status);

    user.updateProfile({
      email: email.value,
      firstName: params.firstName,
      lastName: params.lastName,
      status: params.status,
      updatedBy: params.updatedBy,
    });

    this.eventPublisher.dispatch(user);

    return ok(user);
  }
}
