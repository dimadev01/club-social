import { DomainEvent } from '@/shared/domain/events/domain-event';

import { MemberEntity } from '../entities/member.entity';
import { UpdateMemberProfileProps } from '../interfaces/member.interface';

export class MemberUpdatedEvent extends DomainEvent {
  public constructor(
    public readonly member: MemberEntity,
    public readonly changes: UpdateMemberProfileProps,
  ) {
    super(member.id);
  }
}
