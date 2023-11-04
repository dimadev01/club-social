import type { ClientSession } from 'mongodb';
import { Entity } from '@domain/common/entity';

export interface IQueryablePort<T extends Entity> {
  findOneById(id: string): Promise<T | undefined>;
  findOneByIdOrThrow(id: string): Promise<T>;
  findOneByIdOrThrowWithSession(id: string, session: ClientSession): Promise<T>;
}
