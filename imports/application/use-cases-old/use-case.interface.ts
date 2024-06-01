import { Result } from 'neverthrow';

export interface IUseCaseOld<TRequest, TResponse> {
  execute(request?: TRequest): Promise<Result<TResponse, Error>>;
}

export type MongoOptionsOld = {
  limit: number;
  skip: number;
  sort: {
    [field: string]: number;
  };
};
