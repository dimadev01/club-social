import { Global, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

import { DOMAIN_EVENT_EMITTER_PROVIDER } from '@/shared/domain/events/domain-event-emitter';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { UsersModule } from '@/users/user.module';

import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';
import { UserCreatedHandler } from './user-created.handler';
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
  ],
})
export class EventsModule {}
