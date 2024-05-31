import { Result } from 'neverthrow';

import { GetModelRequest } from '@domain/common/get-model.request';
import {
  FindPaginatedRequestNewV,
  FindPaginatedResponseNewV,
} from '@domain/common/repositories/queryable-grid-repository.interface';

export interface IUseCaseNewV<TRequest, TResponse> {
  execute(request?: TRequest): Promise<Result<TResponse, Error>>;
}

export type IEntityDtoUseCase<
  TResponse,
  TRequest extends GetModelRequest = GetModelRequest,
> = IUseCaseNewV<TRequest, TResponse>;

export type IGridUseCase<
  TRequest extends FindPaginatedRequestNewV = FindPaginatedRequestNewV,
  TModelResponse extends object = object,
  TResponse extends
    FindPaginatedResponseNewV<TModelResponse> = FindPaginatedResponseNewV<TModelResponse>,
> = IUseCaseNewV<TRequest, TResponse>;
