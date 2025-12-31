import { Global, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

import { DOMAIN_EVENT_EMITTER_PROVIDER } from '@/shared/domain/events/domain-event-emitter';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';

@Global()
@Module({
  exports: [DomainEventPublisher],
  imports: [EventEmitterModule.forRoot()],
  providers: [
    DomainEventPublisher,
    {
      provide: DOMAIN_EVENT_EMITTER_PROVIDER,
      useExisting: EventEmitter2,
    },
  ],
})
export class EventsModule {}
