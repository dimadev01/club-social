import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { UserEmailUpdatedEvent } from '@/domain/users/events/user-email-updated.event';

@Injectable()
export class UserEmailUpdatedHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserEmailUpdatedHandler.name);
  }

  @OnEvent(UserEmailUpdatedEvent.name)
  public async handle(event: UserEmailUpdatedEvent): Promise<void> {
    this.logger.info({
      message: 'Updating user email',
      params: {
        userId: event.user.id.value,
      },
    });

    this.logger.info({
      message: 'User email updated',
      params: {
        userId: event.user.id.value,
      },
    });
  }
}
