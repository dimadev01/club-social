import { Model } from '@domain/common/models/model';

export interface FindOneById {
  id: string;
}

export interface FindManyByIds {
  ids: string[];
}

export interface IQueryableRepository<TDomain extends Model> {
  findByIds(request: FindManyByIds): Promise<TDomain[]>;
  findOneById(request: FindOneById): Promise<TDomain | null>;
  findOneByIdOrThrow(request: FindOneById): Promise<TDomain>;
}
