import { BaseError } from '@domain/common/errors/base.error';

export class InternalServerError extends BaseError {
  public constructor(message = 'Internal Server Error') {
    super(message);
  }
}
