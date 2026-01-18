import { Guard } from '../guards';

export abstract class ErrorMapper {
  public static unknownToError(value: unknown): Error {
    if (Guard.isError(value)) {
      return value;
    }

    if (Guard.isString(value)) {
      return new Error(value);
    }

    if (Guard.isNil(value)) {
      return new Error('Unknown error');
    }

    return new Error(JSON.stringify(value));
  }
}
