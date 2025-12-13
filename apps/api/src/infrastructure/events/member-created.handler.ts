import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MemberCreatedEvent } from '@/members/domain/events/member-created.event';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { BetterAuthService } from '../auth/better-auth/better-auth.service';
import { ClsService } from '../storage/cls/cls.service';

@Injectable()
export class MemberCreatedHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly betterAuth: BetterAuthService,
    private readonly clsService: ClsService,
  ) {
    this.logger.setContext(MemberCreatedHandler.name);
  }

  @OnEvent(MemberCreatedEvent.name)
  public async handle(event: MemberCreatedEvent): Promise<void> {
    this.logger.info({
      memberId: event.member.id.value,
      message: 'Creating member',
    });

    await this.betterAuth.auth.api.createUser({
      body: {
        data: {
          createdBy: event.member.createdBy,
          deletedAt: null,
          deletedBy: null,
          firstName: event.member.firstName,
          id: event.member.id.value,
          lastName: event.member.lastName,
          status: event.member.status,
          updatedBy: event.member.createdBy,
        },
        email: event.member.email.value,
        name: `${event.member.firstName} ${event.member.lastName}`,
        password: UniqueId.generate().value,
        role: event.member.role,
      },
      headers: this.clsService.get('headers'),
    });
  }
}
