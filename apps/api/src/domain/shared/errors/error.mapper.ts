import { Guard } from '../guards';

export class ErrorMapper {
  public static unknownToError(value: unknown): Error {
    if (Guard.isError(value)) {
      return value;
    }

    if (Guard.isString(value)) {
      return new Error(value);
    }

    if (Guard.isNull(value)) {
      return new Error('Unknown error');
    }

    if (Guard.isUndefined(value)) {
      return new Error('Unknown error');
    }

    return new Error(JSON.stringify(value));
  }
}
