import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { fromNodeHeaders } from 'better-auth/node';
import { ClsService } from 'nestjs-cls';

import { APP_LOGGER_PROVIDER } from '@/application/shared/logger/logger';
import { UserUpdatedEvent } from '@/domain/users/events/user-updated.event';

import { BetterAuthService } from '../auth/better-auth.service';
import { AppLoggerService } from '../logger/logger.service';
import { AsyncLocalStorageStore } from '../storage/cls/app-cls.service';

@Injectable()
export class UserUpdatedHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLoggerService,
    private readonly betterAuth: BetterAuthService,
    private readonly cls: ClsService<AsyncLocalStorageStore>,
  ) {
    this.logger.setContext(UserUpdatedHandler.name);
  }

  @OnEvent(UserUpdatedEvent.name)
  public async handle(event: UserUpdatedEvent): Promise<void> {
    this.logger.info({
      message: 'Updating user',
      params: {
        userId: event.aggregateId,
      },
    });

    // await this.userRepository.save(event.changes);

    await this.betterAuth.auth.api.adminUpdateUser({
      body: {
        data: {
          email: event.changes.email.value,
          firstName: event.changes.firstName,
          lastName: event.changes.lastName,
          status: event.changes.status,
          updatedBy: event.changes.updatedBy,
        },
        userId: event.aggregateId.value,
      },
      headers: fromNodeHeaders(this.cls.get('headers')),
    });
  }
}
