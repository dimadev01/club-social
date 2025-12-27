import { Inject, Injectable } from '@nestjs/common';

import { BetterAuthService } from '@/infrastructure/auth/better-auth/better-auth.service';
import { ClsService } from '@/infrastructure/storage/cls/cls.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { InternalServerError } from '@/shared/domain/errors/internal-server.error';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { UserEntity } from '../domain/entities/user.entity';
import { UserCreatedEvent } from '../domain/events/user-created.event';
import { UserUpdatedEvent } from '../domain/events/user-updated.event';
import { UserWriteableRepository } from '../domain/user.repository';

@Injectable()
export class BetterAuthUserRepository implements UserWriteableRepository {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly betterAuth: BetterAuthService,
    private readonly clsService: ClsService,
  ) {
    this.logger.setContext(BetterAuthUserRepository.name);
  }

  public async save(user: UserEntity): Promise<void> {
    const events = user.pullEvents();

    const hasCreatedEvent = events.some(
      (event) => event instanceof UserCreatedEvent,
    );
    const hasUpdatedEvent = events.some(
      (event) => event instanceof UserUpdatedEvent,
    );

    if (hasCreatedEvent) {
      return this.createUser(user);
    }

    if (hasUpdatedEvent) {
      await this.updateUser(user);
    }

    throw new InternalServerError('No event found to save user');
  }

  private async createUser(user: UserEntity): Promise<void> {
    const headers = this.clsService.get('headers');
    const hasCookies = headers.has('cookie');

    await this.betterAuth.auth.api.createUser({
      body: {
        data: {
          createdBy: user.createdBy,
          deletedAt: null,
          deletedBy: null,
          firstName: user.name.firstName,
          id: user.id.value,
          lastName: user.name.lastName,
          status: user.status,
          updatedAt: user.updatedAt,
          updatedBy: user.createdBy,
        },
        email: user.email.value,
        name: user.name.fullNameFirstNameFirst,
        password: UniqueId.generate().value,
        role: user.role as 'admin' | 'user' | ('admin' | 'user')[] | undefined,
      },
      headers: hasCookies ? headers : undefined,
    });
  }

  private async updateUser(user: UserEntity): Promise<void> {
    const headers = this.clsService.get('headers');
    const hasCookies = headers.has('cookie');

    await this.betterAuth.auth.api.adminUpdateUser({
      body: {
        data: {
          email: user.email.value,
          firstName: user.name.firstName,
          lastName: user.name.lastName,
          status: user.status,
          updatedAt: user.updatedAt,
          updatedBy: user.createdBy,
        },
        userId: user.id.value,
      },
      headers: hasCookies ? headers : undefined,
    });
  }
}
