import { UserStatus } from '@club-social/shared/users';
import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ConflictError } from '@/shared/domain/errors/conflict.error';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok } from '@/shared/domain/result';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UserEntity } from '@/users/domain/entities/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

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

    const existingUserByEmail = await this.userRepository.findUniqueByEmail(
      email.value,
    );

    if (existingUserByEmail) {
      return err(new ConflictError('El email ya está en uso'));
    }

    const user = UserEntity.create({
      banExpires: null,
      banned: false,
      banReason: null,
      createdBy: params.createdBy,
      email: email.value,
      firstName: params.firstName,
      lastName: params.lastName,
      role: params.role,
      status: UserStatus.ACTIVE,
    });

    if (user.isErr()) {
      return err(user.error);
    }

    this.eventPublisher.dispatch(user.value);

    return ok(user.value);
  }
}
