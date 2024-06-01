import { singleton } from 'tsyringe';

import { MongoCollectionNewV } from '@infra/mongo/collections/mongo.collection';
import { MemberEntity } from '@infra/mongo/entities/member.entity';

@singleton()
export class MemberCollectionNewV extends MongoCollectionNewV<MemberEntity> {
  public constructor() {
    super('members');
  }
}
