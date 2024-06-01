import { Model } from '@domain/common/models/model';

export interface FindOneByIdModelRequest {
  id: string;
}

export interface FindByIdsModelRequest {
  ids: string[];
}

export interface IQueryableRepository<TModel extends Model> {
  findByIds(request: FindByIdsModelRequest): Promise<TModel[]>;
  findOneById(request: FindOneByIdModelRequest): Promise<TModel | null>;
  findOneByIdOrThrow(request: FindOneByIdModelRequest): Promise<TModel>;
}
