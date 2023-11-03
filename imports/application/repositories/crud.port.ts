import { ICreatablePort } from '@application/repositories/creatable.port';
import { IDeletablePort } from '@application/repositories/deletable.port';
import { IQueryablePort } from '@application/repositories/queryable.port';
import { IRemovablePort } from '@application/repositories/removable.port';
import { IUpdatablePort } from '@application/repositories/updatable.port';
import { Entity } from '@domain/common/entity';

export interface ICrudPort<T extends Entity>
  extends ICreatablePort<T>,
    IRemovablePort,
    IDeletablePort<T>,
    IQueryablePort<T>,
    IUpdatablePort<T> {}
