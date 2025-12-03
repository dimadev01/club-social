import { Global, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

import { DOMAIN_EVENT_EMITTER_PROVIDER } from '@/domain/shared/events/domain-event-emitter';
import { DomainEventPublisher } from '@/domain/shared/events/domain-event-publisher';
import { UsersModule } from '@/presentation/users/users.module';

import { SupabaseModule } from '../supabase/supabase.module';
import { UserCreatedHandler } from './user-created.handler';
import { UserEmailUpdatedHandler } from './user-email-updated.handler';

@Global()
@Module({
  exports: [DomainEventPublisher],
  imports: [EventEmitterModule.forRoot(), UsersModule, SupabaseModule],
  providers: [
    DomainEventPublisher,
    {
      provide: DOMAIN_EVENT_EMITTER_PROVIDER,
      useExisting: EventEmitter2,
    },
    UserCreatedHandler,
    UserEmailUpdatedHandler,
  ],
})
export class EventsModule {}
