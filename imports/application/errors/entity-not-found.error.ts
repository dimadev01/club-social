import { BaseErrorOld } from '@application/errors/error.base';

export class EntityNotFoundError<T> extends BaseErrorOld {
  public constructor(entity: new () => T) {
    super(`${entity.name} not found`);
  }
}
