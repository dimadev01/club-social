import type { ClientSession } from 'mongodb';

import { Entity } from '@domain/common/entity.old';

export interface IQueryablePort<T extends Entity> {
  findByIds(ids: string[]): Promise<T[]>;
  findOneById(id: string): Promise<T | undefined>;
  findOneByIdOrThrow(id: string): Promise<T>;
  findOneByIdOrThrowWithSession(id: string, session: ClientSession): Promise<T>;
}
