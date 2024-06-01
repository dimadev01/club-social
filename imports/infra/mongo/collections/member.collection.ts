import { MemberEntity } from '@adapters/members/entities/member.entity';
import { MongoCollection } from '@adapters/mongo/collections/mongo.collection';

export class MemberMongoCollection extends MongoCollection<MemberEntity> {
  public constructor() {
    super('members');
  }
}
