import { Inject, Injectable } from '@nestjs/common';

import { Entity } from '@/shared/domain/entity';
import {
  DOMAIN_EVENT_EMITTER_PROVIDER,
  type DomainEventEmitter,
} from '@/shared/domain/events/domain-event-emitter';

@Injectable()
export class DomainEventPublisher {
  public constructor(
    @Inject(DOMAIN_EVENT_EMITTER_PROVIDER)
    private readonly emitter: DomainEventEmitter,
  ) {}

  public dispatch(aggregate: Entity<unknown>): void {
    const events = aggregate.pullEvents();

    for (const event of events) {
      this.emitter.emit(event.constructor.name, event);
    }
  }
}
