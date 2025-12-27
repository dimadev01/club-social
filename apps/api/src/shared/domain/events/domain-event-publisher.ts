import { Inject, Injectable } from '@nestjs/common';

import {
  DOMAIN_EVENT_EMITTER_PROVIDER,
  type DomainEventEmitter,
} from '@/shared/domain/events/domain-event-emitter';

import { AggregateRoot } from '../aggregate-root';

@Injectable()
export class DomainEventPublisher {
  public constructor(
    @Inject(DOMAIN_EVENT_EMITTER_PROVIDER)
    private readonly emitter: DomainEventEmitter,
  ) {}

  public dispatch(aggregate: AggregateRoot): void {
    const events = aggregate.pullEvents();

    for (const event of events) {
      this.emitter.emit(event.constructor.name, event);
    }
  }
}
