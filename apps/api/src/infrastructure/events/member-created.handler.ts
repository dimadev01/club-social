import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MemberCreatedEvent } from '@/members/domain/events/member-created.event';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

import { BetterAuthService } from '../auth/better-auth/better-auth.service';
import { ClsService } from '../storage/cls/cls.service';

@Injectable()
export class MemberCreatedHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly betterAuth: BetterAuthService,
    private readonly clsService: ClsService,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {
    this.logger.setContext(MemberCreatedHandler.name);
  }

  @OnEvent(MemberCreatedEvent.name)
  public async handle(event: MemberCreatedEvent): Promise<void> {
    this.logger.info({
      memberId: event.member.id.value,
      message: 'Creating member',
    });

    const user = await this.userRepository.findOneByIdOrThrow(
      event.member.userId,
    );

    await this.betterAuth.auth.api.createUser({
      body: {
        data: {
          createdBy: user.createdBy,
          deletedAt: null,
          deletedBy: null,
          firstName: user.firstName,
          id: user.id.value,
          lastName: user.lastName,
          status: user.status,
          updatedBy: user.createdBy,
        },
        email: user.email.value,
        name: `${user.firstName} ${user.lastName}`,
        password: UniqueId.generate().value,
        role: user.role,
      },
      headers: this.clsService.get('headers'),
    });
  }
}
