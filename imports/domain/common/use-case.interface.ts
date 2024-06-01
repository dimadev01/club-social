import { Result } from 'neverthrow';

import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';
import { FindOneByIdModelRequest } from '@domain/common/repositories/queryable.repository';

export interface IUseCase<TRequest, TResponse> {
  execute(request?: TRequest): Promise<Result<TResponse, Error>>;
}

export type IModelUseCase<
  TResponse,
  TRequest extends FindOneByIdModelRequest = FindOneByIdModelRequest,
> = IUseCase<TRequest, TResponse>;

export type IGridUseCase<
  TRequest extends FindPaginatedRequest = FindPaginatedRequest,
  TModelResponse extends object = object,
  TResponse extends
    FindPaginatedResponse<TModelResponse> = FindPaginatedResponse<TModelResponse>,
> = IUseCase<TRequest, TResponse>;
