import { MemberAuditEntity } from '@adapters/members/entities/member-audit.entity';
import { MongoCollection } from '@adapters/mongo/collections/mongo.collection';

export class MemberAuditableCollection extends MongoCollection<MemberAuditEntity> {
  public constructor() {
    super('member.audits');
  }
}
