import { BaseError } from '@application/errors/error.base';

export class InternalServerError extends BaseError {
  public constructor(message = 'Internal server error') {
    super(message);
  }
}
