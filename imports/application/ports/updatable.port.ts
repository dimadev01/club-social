import type { ClientSession } from 'mongodb';

import { EntityOld } from '@domain/common/entity.old';

export interface IUpdatablePort<T extends EntityOld> {
  update(entity: T): Promise<void>;
  updateWithSession(entity: T, session: ClientSession): Promise<void>;
}
