import { singleton } from 'tsyringe';

import { MongoCollection } from '@infra/mongo/common/collections/mongo.collection';
import { MovementAuditEntity } from '@infra/mongo/entities/movement-audit.entity';

@singleton()
export class MovementAuditableCollection extends MongoCollection<MovementAuditEntity> {
  public constructor() {
    super('movement.audits');
  }
}
