import { Result } from 'neverthrow';

import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/queryable-grid-repository.interface';

export interface IUseCase<TRequest, TResponse> {
  execute(request?: TRequest): Promise<Result<TResponse, Error>>;
}

export type IGridUseCase<
  TRequest extends FindPaginatedRequest = FindPaginatedRequest,
  TResponse extends object = object,
> = IUseCase<TRequest, FindPaginatedResponse<TResponse>>;
