import { DomainEvent } from './domain-event';

export const DOMAIN_EVENT_EMITTER_PROVIDER = Symbol('DomainEventEmitter');

export interface DomainEventEmitter {
  emit(eventName: string, event: DomainEvent): boolean;
}
