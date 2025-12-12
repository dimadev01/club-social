import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UserCreatedEvent } from '@/users/domain/events/user-created.event';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

@Injectable()
export class UserCreatedHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {
    this.logger.setContext(UserCreatedHandler.name);
  }

  @OnEvent(UserCreatedEvent.name)
  public async handle(event: UserCreatedEvent): Promise<void> {
    this.logger.info({
      message: 'Creating user',
      params: {
        userId: event.user.id.value,
      },
    });

    await this.userRepository.save(event.user);
  }
}
