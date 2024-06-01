import { BaseErrorOld } from '@application/errors/error.base';

export class UserNotFoundError extends BaseErrorOld {
  public constructor() {
    super('Usuario no encontrado');
  }
}
