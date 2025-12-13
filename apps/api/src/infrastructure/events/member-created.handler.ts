import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MemberCreatedEvent } from '@/members/domain/events/member-created.event';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
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
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
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
          createdBy: event.user.createdBy,
          deletedAt: null,
          deletedBy: null,
          firstName: event.user.firstName,
          id: event.user.id.value,
          lastName: event.user.lastName,
          status: event.user.status,
          updatedAt: event.occurredAt,
          updatedBy: event.user.createdBy,
        },
        email: event.user.email.value,
        name: `${event.user.firstName} ${event.user.lastName}`,
        password: UniqueId.generate().value,
        role: event.user.role,
      },
      headers: this.clsService.get('headers'),
    });

    await this.memberRepository.save(event.member);

    this.logger.info({
      memberId: event.member.id.value,
      message: 'Member created',
    });
  }
}
