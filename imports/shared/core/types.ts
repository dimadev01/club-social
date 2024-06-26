/**
 * UUIDv4 type
 */
export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`;

/**
 * UID interface
 */
export interface UID<T = UUIDv4> {
  get value(): T;
}

/**
 * IEntity interface
 */
export interface IEntity {
  get id(): UID;
}

export type Result<T, E extends Error> = IResultOk<T> | IResultErr<E>;

export interface IResultErr<E extends Error> extends IResult<never> {
  readonly error: E;
  isErr(): this is IResultErr<E>;
  isOk(): this is IResultOk<never>;
}

export interface IResult<T> {
  isErr(): boolean;
  isOk(): boolean;
  unsafeValue(): T;
}

export interface IResultOk<T> extends IResult<T> {
  isErr(): this is IResultErr<never>;
  isOk(): this is IResultOk<T>;
  readonly value: T;
}
