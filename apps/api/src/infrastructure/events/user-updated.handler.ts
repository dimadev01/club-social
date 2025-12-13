import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UserUpdatedEvent } from '@/users/domain/events/user-updated.event';

import { BetterAuthService } from '../auth/better-auth/better-auth.service';
import { ClsService } from '../storage/cls/cls.service';

@Injectable()
export class UserUpdatedHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly betterAuth: BetterAuthService,
    private readonly clsService: ClsService,
  ) {
    this.logger.setContext(UserUpdatedHandler.name);
  }

  @OnEvent(UserUpdatedEvent.name)
  public async handle(event: UserUpdatedEvent): Promise<void> {
    this.logger.info({
      message: 'Updating user',
      userId: event.aggregateId.value,
    });

    await this.betterAuth.auth.api.adminUpdateUser({
      body: {
        data: {
          email: event.changes.email.value,
          firstName: event.changes.firstName,
          lastName: event.changes.lastName,
          status: event.changes.status,
          updatedAt: event.occurredAt,
          updatedBy: event.changes.updatedBy,
        },
        userId: event.aggregateId.value,
      },
      headers: this.clsService.get('headers'),
    });
  }
}
