import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { MemberCreditEntity } from '@infra/mongo/entities/member-credit.entity';

@singleton()
export class MemberCreditCollection extends MongoCollection<MemberCreditEntity> {
  public constructor() {
    super('member.credits');
  }
}
