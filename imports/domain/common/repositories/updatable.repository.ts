import { Model } from '@domain/common/models/model';

export interface IUpdatableRepository<TModel extends Model, TSession> {
  update(model: TModel): Promise<void>;
  updateWithSession(model: TModel, session: TSession): Promise<void>;
}
