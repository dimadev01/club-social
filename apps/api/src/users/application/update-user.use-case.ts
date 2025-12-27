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
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/users/domain/entities/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

export interface UpdateUserParams {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  status: UserStatus;
  updatedBy: string;
}

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

    const userId = UniqueId.raw({ value: params.id });

    if (existingUserByEmail && !existingUserByEmail.id.equals(userId)) {
      return err(new ConflictError('El email ya está en uso'));
    }

    const user = await this.userRepository.findUniqueOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    user.updateProfile({
      email: email.value,
      firstName: params.firstName,
      lastName: params.lastName,
      status: params.status,
      updatedBy: params.updatedBy,
    });

    await this.userRepository.save(user);
    this.eventPublisher.dispatch(user);

    return ok(user);
  }
}
