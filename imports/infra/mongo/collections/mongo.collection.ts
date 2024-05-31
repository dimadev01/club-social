import { Mongo } from 'meteor/mongo';

import { EntityNewV } from '@infra/mongo/entities/common/entity';

export class MongoCollectionNewV<
  T extends EntityNewV,
> extends Mongo.Collection<T> {
  public constructor(name: string) {
    super(name);
  }
}
