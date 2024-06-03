import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { MemberEntity } from '@infra/mongo/entities/member.entity';

@singleton()
export class MemberMongoCollection extends MongoCollection<MemberEntity> {
  public constructor() {
    super('members');
  }
}
