import type { ClientSession, OptionalUnlessRequiredId } from 'mongodb';

import { EntityOld } from '@domain/common/entity.old';

export interface ICreatablePort<T extends EntityOld> {
  create(entity: Mongo.OptionalId<T>): Promise<string>;
  createWithSession(
    entity: OptionalUnlessRequiredId<T>,
    session: ClientSession,
  ): Promise<string>;
}
