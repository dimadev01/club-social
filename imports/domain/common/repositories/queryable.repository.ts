import { Model } from '@domain/common/models/model';

export interface IQueryableRepository<TModel extends Model> {
  findByIds(ids: string[]): Promise<TModel[]>;
  findOneById(id: string): Promise<TModel | null>;
  findOneByIdOrThrow(id: string): Promise<TModel>;
}
