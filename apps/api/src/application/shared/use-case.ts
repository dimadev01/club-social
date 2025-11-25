import type { Result } from '@/domain/shared/result';

import { AppLogger } from './logger/logger';

export abstract class UseCase<
  TResponse = unknown,
  TError extends Error = Error,
> {
  protected constructor(protected readonly logger: AppLogger) {
    this.logger.setContext(this.constructor.name);
  }

  public abstract execute(
    request?: unknown,
  ): Promise<Result<TResponse, TError>>;
}
