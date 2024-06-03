import { Model } from '@domain/common/models/model';

export interface FindOneModelByIdRequest {
  id: string;
}

export interface FindModelsByIdsRequest {
  ids: string[];
}

export interface IQueryableRepository<TDomain extends Model> {
  findByIds(request: FindModelsByIdsRequest): Promise<TDomain[]>;
  findOneById(request: FindOneModelByIdRequest): Promise<TDomain | null>;
  findOneByIdOrThrow(request: FindOneModelByIdRequest): Promise<TDomain>;
}
