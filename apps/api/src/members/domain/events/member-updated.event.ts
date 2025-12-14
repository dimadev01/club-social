import { DomainEvent } from '@/shared/domain/events/domain-event';

import { MemberEntity } from '../entities/member.entity';

export class MemberUpdatedEvent extends DomainEvent {
  public constructor(public readonly member: MemberEntity) {
    super(member.id);
  }
}
