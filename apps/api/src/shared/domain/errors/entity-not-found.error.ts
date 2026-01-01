import { ApplicationError } from './application.error';

export class EntityNotFoundError extends ApplicationError {
  public constructor(message = 'Entity not found', error?: Error) {
    super(message, error);
  }
}
