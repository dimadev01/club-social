import { Result } from 'neverthrow';

export interface IUseCase<TRequest, TResponse> {
  execute(request?: TRequest): Promise<Result<TResponse, Error>>;
}

export type MongoOptions = {
  limit: number;
  skip: number;
  sort: {
    [field: string]: number;
  };
};
