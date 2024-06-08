import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { MemberAuditEntity } from '@infra/mongo/entities/member-audit.entity';

@singleton()
export class MemberMongoAuditableCollection extends MongoCollection<MemberAuditEntity> {
  public constructor() {
    super('member.audits');
  }
}
