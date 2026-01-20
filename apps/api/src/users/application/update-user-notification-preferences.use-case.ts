import { UpdateUserNotificationPreferencesDto } from '@club-social/shared/users';
import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ok } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/users/domain/entities/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

export interface UpdateUserNotificationPreferencesParams {
  notificationPreferences: UpdateUserNotificationPreferencesDto;
  updatedBy: string;
  userId: string;
}

export class UpdateUserNotificationPreferencesUseCase extends UseCase<UserEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {
    super(logger);
  }

  public async execute(
    params: UpdateUserNotificationPreferencesParams,
  ): Promise<Result<UserEntity>> {
    this.logger.info({
      message: 'Updating user notification preferences',
      params,
    });

    const user = await this.userRepository.findByIdOrThrow(
      UniqueId.raw({ value: params.userId }),
    );

    user.updateNotificationPreferences(
      params.notificationPreferences,
      params.updatedBy,
    );

    await this.userRepository.save(user);

    return ok(user);
  }
}
