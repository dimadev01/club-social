import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MemberUpdatedEvent } from '@/members/domain/events/member-updated.event';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

import { BetterAuthService } from '../auth/better-auth/better-auth.service';
import { ClsService } from '../storage/cls/cls.service';

@Injectable()
export class MemberUpdatedHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly betterAuth: BetterAuthService,
    private readonly clsService: ClsService,
  ) {
    this.logger.setContext(MemberUpdatedHandler.name);
  }

  @OnEvent(MemberUpdatedEvent.name)
  public async handle(event: MemberUpdatedEvent): Promise<void> {
    this.logger.info({
      memberId: event.aggregateId.value,
      message: 'Updating member',
    });

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
      headers: this.clsService.get('headers'),
    });
  }
}
