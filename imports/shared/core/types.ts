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
