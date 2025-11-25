import type { DomainEventInterface } from './domain-event';

import { UniqueId } from './value-objects/unique-id/unique-id.vo';

export abstract class AggregateRoot<T> {
  public get id(): UniqueId {
    return this._id;
  }

  protected readonly _id: UniqueId;

  private _events: DomainEventInterface[] = [];

  public constructor(id?: UniqueId) {
    this._id = id ?? UniqueId.generate();
  }

  public clearEvents(): void {
    this._events = [];
  }

  public equals(entity: AggregateRoot<T>): boolean {
    if (this === entity) {
      return true;
    }

    return this._id.equals(entity.id);
  }

  public pullEvents(): DomainEventInterface[] {
    const events = [...this._events];

    this.clearEvents();

    return events;
  }

  protected addEvent(event: DomainEventInterface): void {
    this._events.push(event);
  }
}
