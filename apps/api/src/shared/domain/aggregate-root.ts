import { Entity } from './entity';
import { DomainEvent } from './events/domain-event';

export abstract class AggregateRoot extends Entity {
  private _events: DomainEvent[] = [];

  public pullEvents(): DomainEvent[] {
    const events = [...this._events];

    this._events = [];

    return events;
  }

  protected addEvent(event: DomainEvent): void {
    this._events.push(event);
  }
}
