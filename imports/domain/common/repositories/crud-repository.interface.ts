import { ICreatableRepository } from './creatable-repository.interface';
import { IQueryableRepository } from './queryable-repository.interface';
import { IUpdatableRepository } from './updatable-repository.interface';

import { Model } from '@domain/common/models/model';

export interface ICrudRepository<TModel extends Model, TSession>
  extends ICreatableRepository<TModel, TSession>,
    IQueryableRepository<TModel>,
    IUpdatableRepository<TModel, TSession> {}
