import { BaseError } from '@application/errors/error.base';

export class InternalServerError extends BaseError {
  public constructor() {
    super('Internal server error');
  }
}
