import { IResultErr, IResultOk } from '@shared/core/types';

export class Err<E extends Error = Error> implements IResultErr<E> {
  public constructor(public readonly error: E) {}

  public isErr(): this is IResultErr<E> {
    return true;
  }

  public isOk(): this is IResultOk<never> {
    return !this.isErr();
  }

  public unsafeValue(): never {
    throw new Error('No value');
  }
}

export const err = <E extends Error = Error>(error: E): IResultErr<E> =>
  new Err(error);
