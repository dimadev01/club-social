import type { UniqueId } from '../value-objects/unique-id/unique-id.vo';

export abstract class DomainEvent {
  public readonly aggregateId: UniqueId;
  public readonly eventType: string;
  public readonly occurredAt: Date;

  public constructor(aggregateId: UniqueId) {
    this.occurredAt = new Date();
    this.aggregateId = aggregateId;
    this.eventType = new.target.name;
  }
}
