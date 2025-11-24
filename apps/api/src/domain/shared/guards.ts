export type TypeGuard<T = unknown> = (target: unknown) => target is T;

export abstract class Guard {
  public static array(
    target: unknown,
    message = 'Target is not an array',
  ): void {
    this.invariant(target, this.isArray, message);
  }

  public static boolean(
    target: unknown,
    message = 'Target is not a boolean',
  ): void {
    this.invariant(target, this.isBoolean, message);
  }

  public static date(target: unknown, message = 'Target is not a date'): void {
    this.invariant(target, this.isDate, message);
  }

  public static isArray: TypeGuard<unknown[]> = (
    target: unknown,
  ): target is unknown[] => Array.isArray(target);

  public static isBoolean: TypeGuard<boolean> = (
    target: unknown,
  ): target is boolean => typeof target === 'boolean';

  public static isDate: TypeGuard<Date> = (target: unknown): target is Date =>
    target instanceof Date;

  public static isError: TypeGuard<Error> = (
    target: unknown,
  ): target is Error => target instanceof Error;

  public static isNil: TypeGuard<null | undefined> = (
    target: unknown,
  ): target is null | undefined => target === null || target === undefined;

  public static isNull: TypeGuard<null> = (target: unknown): target is null =>
    target === null;

  public static isNumber: TypeGuard<number> = (
    target: unknown,
  ): target is number => typeof target === 'number';

  public static isObject: TypeGuard<object> = (
    target: unknown,
  ): target is object => typeof target === 'object' && target !== null;

  public static isString: TypeGuard<string> = (
    target: unknown,
  ): target is string => typeof target === 'string';

  public static isUndefined: TypeGuard<undefined> = (
    target: unknown,
  ): target is undefined => target === undefined;

  public static nil(target: unknown, message = 'Target is not nil'): void {
    this.invariant(target, this.isNil, message);
  }

  public static null(target: unknown, message = 'Target is not null'): void {
    this.invariant(target, this.isNull, message);
  }

  public static number(
    target: unknown,
    message = 'Target is not a number',
  ): void {
    this.invariant(target, this.isNumber, message);
  }

  public static object(
    target: unknown,
    message = 'Target is not an object',
  ): void {
    this.invariant(target, this.isObject, message);
  }

  public static string(
    target: unknown,
    message = 'Target is not a string',
  ): void {
    this.invariant(target, this.isString, message);
  }

  public static undefined(
    target: unknown,
    message = 'Target is not undefined',
  ): void {
    this.invariant(target, this.isUndefined, message);
  }

  private static invariant<T>(
    target: unknown,
    guard: TypeGuard<T>,
    message = 'Assertion failed',
  ): asserts target is T {
    if (!guard(target)) {
      throw new Error(message);
    }
  }
}
