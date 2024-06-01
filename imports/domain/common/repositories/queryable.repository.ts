import { Model } from '@domain/common/models/model';

export interface FindOneModelByIdRequest {
  id: string;
}

export interface FindModelsByIdsRequest {
  ids: string[];
}

export interface IQueryableRepository<TModel extends Model> {
  findByIds(request: FindModelsByIdsRequest): Promise<TModel[]>;
  findOneById(request: FindOneModelByIdRequest): Promise<TModel | null>;
  findOneByIdOrThrow(request: FindOneModelByIdRequest): Promise<TModel>;
}
