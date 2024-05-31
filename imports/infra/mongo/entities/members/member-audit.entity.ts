import { AuditableEntity } from '@infra/mongo/entities/common/auditable.entity';
import { MemberEntity } from '@infra/mongo/entities/members/member.entity';

export class MemberAuditEntity extends AuditableEntity<MemberEntity> {}
