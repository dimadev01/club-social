import { ICreatableRepository } from './creatable.repository';
import { IQueryableRepository } from './queryable.repository';
import { IUpdatableRepository } from './updatable.repository';

import { Model } from '@domain/common/models/model';
import { IDeletableRepository } from '@domain/common/repositories/deletable.repository';

export interface ICrudRepository<TModel extends Model, TSession>
  extends ICreatableRepository<TModel, TSession>,
    IQueryableRepository<TModel>,
    IDeletableRepository<TModel, TSession>,
    IUpdatableRepository<TModel, TSession> {}
