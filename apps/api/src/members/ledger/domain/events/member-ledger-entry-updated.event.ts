import { DomainEvent } from '@/shared/domain/events/domain-event';

import { MemberLedgerEntryEntity } from '../entities/member-ledger-entry.entity';

export class MemberLedgerEntryUpdatedEvent extends DomainEvent {
  public constructor(
    public readonly oldMemberLedgerEntry: MemberLedgerEntryEntity,
    public readonly newMemberLedgerEntry: MemberLedgerEntryEntity,
  ) {
    super(newMemberLedgerEntry.id);
  }
}
