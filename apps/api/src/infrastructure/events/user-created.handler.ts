import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { UserCreatedEvent } from '@/users/domain/events/user-created.event';

import { BetterAuthService } from '../auth/better-auth/better-auth.service';
import { ClsService } from '../storage/cls/cls.service';

@Injectable()
export class UserCreatedHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly betterAuth: BetterAuthService,
    private readonly clsService: ClsService,
  ) {
    this.logger.setContext(UserCreatedHandler.name);
  }

  @OnEvent(UserCreatedEvent.name)
  public async handle(event: UserCreatedEvent): Promise<void> {
    this.logger.info({
      message: 'Creating user',
      userId: event.user.id.value,
    });

    await this.betterAuth.auth.api.createUser({
      body: {
        data: {
          createdBy: event.user.createdBy,
          deletedAt: null,
          deletedBy: null,
          firstName: event.user.firstName,
          id: event.user.id.value,
          lastName: event.user.lastName,
          status: event.user.status,
          updatedBy: event.user.createdBy,
        },
        email: event.user.email.value,
        name: `${event.user.firstName} ${event.user.lastName}`,
        password: UniqueId.generate().value,
        role: event.user.role,
      },
      headers: this.clsService.get('headers'),
    });
  }
}
