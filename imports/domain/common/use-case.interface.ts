import { Result } from 'neverthrow';

import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';
import { FindOneById } from '@domain/common/repositories/queryable.repository';

export interface IUseCase<TRequest, TResponse> {
  execute(request?: TRequest): Promise<Result<TResponse, Error>>;
}

export type IModelUseCase<
  TResponse,
  TRequest extends FindOneById = FindOneById,
> = IUseCase<TRequest, TResponse>;

export type IGridUseCase<
  TRequest extends FindPaginatedRequest = FindPaginatedRequest,
  TDomainResponse extends object = object,
  TResponse extends
    FindPaginatedResponse<TDomainResponse> = FindPaginatedResponse<TDomainResponse>,
> = IUseCase<TRequest, TResponse>;
