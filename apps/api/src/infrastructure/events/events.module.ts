import { Global, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

import { DOMAIN_EVENT_EMITTER_PROVIDER } from '@/domain/shared/events/domain-event-emitter';
import { DomainEventPublisher } from '@/domain/shared/events/domain-event-publisher';
import { AuthModule } from '@/presentation/shared/auth/auth.module';
import { UsersModule } from '@/presentation/users/user.module';

import { StorageModule } from '../storage/storage.module';
import { UserCreatedHandler } from './user-created.handler';
import { UserEmailUpdatedHandler } from './user-email-updated.handler';
import { UserUpdatedHandler } from './user-updated.handler';

@Global()
@Module({
  exports: [DomainEventPublisher],
  imports: [
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    StorageModule,
  ],
  providers: [
    DomainEventPublisher,
    {
      provide: DOMAIN_EVENT_EMITTER_PROVIDER,
      useExisting: EventEmitter2,
    },
    UserCreatedHandler,
    UserUpdatedHandler,
    UserEmailUpdatedHandler,
  ],
})
export class EventsModule {}
