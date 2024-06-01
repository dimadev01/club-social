import { FindByIdsRequest } from '@adapters/repositories/dues/due-repository.types';
import { Model } from '@domain/common/models/model';

export interface FindByIdModelRequest {
  id: string;
}

export interface FindByIdsModelRequest {
  ids: string[];
}

export interface IQueryableRepository<TModel extends Model> {
  findByIds(request: FindByIdsRequest): Promise<TModel[]>;
  findOneById(request: FindByIdModelRequest): Promise<TModel | null>;
  findOneByIdOrThrow(request: FindByIdModelRequest): Promise<TModel>;
}
