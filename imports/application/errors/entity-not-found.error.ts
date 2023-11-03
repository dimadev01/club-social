import { BaseError } from '@application/errors/error.base';

export class EntityNotFoundError<T> extends BaseError {
  public constructor(entity: new () => T) {
    super(`${entity.name} not found`);
  }
}
