import { Model } from '@domain/common/models/model';

export interface FindOneModelById {
  id: string;
}

export interface FindModelsByIds {
  ids: string[];
}

export interface IQueryableRepository<TDomain extends Model> {
  findByIds(request: FindModelsByIds): Promise<TDomain[]>;
  findOneById(request: FindOneModelById): Promise<TDomain | null>;
  findOneByIdOrThrow(request: FindOneModelById): Promise<TDomain>;
}
