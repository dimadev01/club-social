import type { ClientSession, OptionalUnlessRequiredId } from 'mongodb';

import { Entity } from '@domain/common/entity';

export interface ICreatablePort<T extends Entity> {
  create(entity: Mongo.OptionalId<T>): Promise<string>;
  createWithSession(
    entity: OptionalUnlessRequiredId<T>,
    session: ClientSession,
  ): Promise<string>;
}
