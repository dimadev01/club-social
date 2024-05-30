import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/collections/mongo.collection';
import { MemberAuditEntity } from '@infra/mongo/entities/members/member-audit.entity';

@singleton()
export class MemberAuditCollection extends MongoCollection<MemberAuditEntity> {
  public constructor() {
    super('member.audits');
  }
}
