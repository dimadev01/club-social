import { AuditableEntity } from '@infra/mongo/entities/auditable.entity';
import { MemberEntity } from '@infra/mongo/entities/member.entity';

export class MemberAuditEntity extends AuditableEntity<MemberEntity> {}
