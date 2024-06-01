import { Model } from '@domain/common/models/model';

export interface CreateModelResponse {
  id: string;
}

export interface ICreatableRepository<TModel extends Model, TSession> {
  insert(model: TModel): Promise<void>;
  insertWithSession(model: TModel, session: TSession): Promise<void>;
}
