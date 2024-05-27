import type { ClientSession } from 'mongodb';

import { EntityOld } from '@domain/common/entity.old';

export interface IQueryablePort<T extends EntityOld> {
  findByIds(ids: string[]): Promise<T[]>;
  findOneById(id: string): Promise<T | undefined>;
  findOneByIdOrThrow(id: string): Promise<T>;
  findOneByIdOrThrowWithSession(id: string, session: ClientSession): Promise<T>;
}
