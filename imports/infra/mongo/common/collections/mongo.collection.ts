import { Mongo } from 'meteor/mongo';

import { Entity } from '@infra/mongo/common/entities/entity';

export class MongoCollection<T extends Entity> extends Mongo.Collection<T> {
  public constructor(name: string) {
    super(name);
  }
}
