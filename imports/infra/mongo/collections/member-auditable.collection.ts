import { singleton } from 'tsyringe';

import { MongoCollectionNewV } from '@infra/mongo/collections/mongo.collection';
import { MemberAuditEntity } from '@infra/mongo/entities/member-audit.entity';

@singleton()
export class MemberAuditableCollection extends MongoCollectionNewV<MemberAuditEntity> {
  public constructor() {
    super('member.audits');
  }
}
