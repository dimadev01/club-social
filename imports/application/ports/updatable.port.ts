import type { ClientSession } from 'mongodb';

import { Entity } from '@domain/common/entity';

export interface IUpdatablePort<T extends Entity> {
  update(entity: T): Promise<void>;
  updateWithSession(entity: T, session: ClientSession): Promise<void>;
}
