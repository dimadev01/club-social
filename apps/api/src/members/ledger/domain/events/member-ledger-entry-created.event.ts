import { DomainEvent } from '@/shared/domain/events/domain-event';

import { MemberLedgerEntryEntity } from '../entities/member-ledger-entry.entity';

export class MemberLedgerEntryCreatedEvent extends DomainEvent {
  public constructor(
    public readonly memberLedgerEntry: MemberLedgerEntryEntity,
  ) {
    super(memberLedgerEntry.id);
  }
}
