import { IResultErr, IResultOk } from '@shared/core/types';

export class Ok<T> implements IResultOk<T> {
  public constructor(public readonly value: T) {}

  public isErr(): this is IResultErr<never> {
    return !this.isOk();
  }

  public isOk(): this is IResultOk<T> {
    return true;
  }

  public unsafeValue(): T {
    return this.value as T;
  }
}

export const ok = <T = null>(value: T = null as T): IResultOk<T> =>
  new Ok(value);
