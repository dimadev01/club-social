import { Model } from '@domain/common/models/model';

export interface IDeletableRepository<TModel extends Model, TSession> {
  delete(model: TModel): Promise<void>;
  deleteWithSession(model: TModel, session: TSession): Promise<void>;
}
