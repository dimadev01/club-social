import { Model } from '@domain/common/models/model';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work.interface';

export interface IUpdatableRepository<TModel extends Model, TSession> {
  update(model: TModel): Promise<void>;
  updateWithSession(
    model: TModel,
    unitOfWork: IUnitOfWork<TSession>,
  ): Promise<void>;
}
