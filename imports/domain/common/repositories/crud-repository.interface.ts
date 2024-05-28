import { ICreatableRepository } from './creatable-repository.interface';
import { IQueryableRepository } from './queryable-repository.interface';
import { IUpdatableRepository } from './updatable-repository.interface';

import { Model } from '@domain/common/models/model';
import { IDeletableRepository } from '@domain/common/repositories/deletable-repository.interface';

export interface ICrudRepository<TModel extends Model, TSession>
  extends ICreatableRepository<TModel, TSession>,
    IQueryableRepository<TModel>,
    IDeletableRepository<TModel, TSession>,
    IUpdatableRepository<TModel, TSession> {}
