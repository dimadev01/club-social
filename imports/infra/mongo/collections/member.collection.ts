import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/collections/mongo.collection';
import { MemberEntity } from '@infra/mongo/entities/members/member.entity';

@singleton()
export class MemberCollection extends MongoCollection<MemberEntity> {
  public constructor() {
    super('members2');
  }
}
