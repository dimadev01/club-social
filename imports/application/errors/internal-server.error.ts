import { BaseErrorOld } from '@application/errors/error.base';

export class InternalServerError extends BaseErrorOld {
  public constructor(message = 'Internal server error') {
    super(message);
  }
}
