import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { APP_LOGGER_PROVIDER } from '@/application/shared/logger/logger';
import { Guard } from '@/domain/shared/guards';
import { UserEmailUpdatedEvent } from '@/domain/users/events/user-email-updated.event';

import { AppLoggerService } from '../logger/logger.service';
import { SupabaseRepository } from '../supabase/supabase.repository';

@Injectable()
export class UserEmailUpdatedHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLoggerService,
    private readonly supabaseRepository: SupabaseRepository,
  ) {
    this.logger.setContext(UserEmailUpdatedHandler.name);
  }

  @OnEvent(UserEmailUpdatedEvent.name)
  public async handle(event: UserEmailUpdatedEvent): Promise<void> {
    this.logger.info({
      message: 'Updating user email in Supabase',
      params: {
        userId: event.user.id.value,
      },
    });

    Guard.string(event.user.authId);

    await this.supabaseRepository.updateUser({
      email: event.user.email.value,
      id: event.user.authId,
    });

    this.logger.info({
      message: 'User email updated in Supabase',
      params: {
        userId: event.user.id.value,
      },
    });
  }
}
