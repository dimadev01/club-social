import type { Result } from '@/domain/shared/result';

export abstract class UseCase<
  TResponse = unknown,
  TError extends Error = Error,
> {
  public abstract execute(
    request?: unknown,
  ): Promise<Result<TResponse, TError>>;
}
