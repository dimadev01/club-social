import {
  ok as neverThrowOk,
  Result as NeverThrowResult,
  err as neverThrowResult,
} from 'neverthrow';

export type Result<T = unknown, E = Error> = NeverThrowResult<T, E>;

export function ok(): Result<void>;
export function ok<T>(value: T): Result<T>;

export function ok<T>(value?: T): Result<T | void> {
  return neverThrowOk<T | void>(value as T | void);
}

export const err = <E extends Error = Error>(error: E): Result<never, E> =>
  neverThrowResult<never, E>(error);

export const ResultUtils = {
  combine: NeverThrowResult.combine,
  combineAsync: async <T>(
    tasks: (Promise<Result<T>> | Result<T>)[],
  ): Promise<Result<T[]>> => {
    const results = await Promise.all(
      tasks.map((task) => Promise.resolve(task)),
    );

    return ResultUtils.combine(results);
  },
};
