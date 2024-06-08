import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { MovementEntity } from '@infra/mongo/entities/movement.entity';

@singleton()
export class MovementCollection extends MongoCollection<MovementEntity> {
  public constructor() {
    super('movements');
  }
}
