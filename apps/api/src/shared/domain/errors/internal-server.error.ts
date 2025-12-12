import { ApplicationError } from './application.error';

export class InternalServerError extends ApplicationError {
  public constructor(message = 'Unexpected internal error.') {
    super(message);
  }
}
