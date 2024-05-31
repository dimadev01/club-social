import { Result } from 'neverthrow';

import { GetModelRequest } from '@domain/common/get-model.request';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/queryable-grid-repository.interface';

export interface IUseCaseNewV<TRequest, TResponse> {
  execute(request?: TRequest): Promise<Result<TResponse, Error>>;
}

export type IEntityDtoUseCase<
  TResponse,
  TRequest extends GetModelRequest = GetModelRequest,
> = IUseCaseNewV<TRequest, TResponse>;

export type IGridUseCase<
  TRequest extends FindPaginatedRequest = FindPaginatedRequest,
  TModelResponse extends object = object,
  TResponse extends
    FindPaginatedResponse<TModelResponse> = FindPaginatedResponse<TModelResponse>,
> = IUseCaseNewV<TRequest, TResponse>;
