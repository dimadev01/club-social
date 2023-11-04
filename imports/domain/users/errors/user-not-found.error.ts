import { BaseError } from '@application/errors/error.base';

export class UserNotFoundError extends BaseError {
  public constructor() {
    super('Usuario no encontrado');
  }
}
