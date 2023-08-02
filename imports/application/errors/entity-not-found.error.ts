import { BaseError } from '@application/errors/error.base';

export class EntityNotFoundError<T extends object> extends BaseError {
  public constructor(entity: T) {
    super(`${entity.constructor.name} not found`);
  }
}
