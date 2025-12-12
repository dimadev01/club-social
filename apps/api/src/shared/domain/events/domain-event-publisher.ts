import { Inject, Injectable } from '@nestjs/common';

import { AggregateRoot } from '@/shared/domain/aggregate-root';
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

  public dispatch(aggregate: AggregateRoot<unknown>): void {
    const events = aggregate.pullEvents();

    for (const event of events) {
      this.emitter.emit(event.constructor.name, event);
    }
  }
}
