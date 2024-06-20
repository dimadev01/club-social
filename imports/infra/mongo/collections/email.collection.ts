import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { EmailEntity } from '@infra/mongo/entities/email.entity';

@singleton()
export class EmailMongoCollection extends MongoCollection<EmailEntity> {
  public constructor() {
    super('emails');
  }
}
