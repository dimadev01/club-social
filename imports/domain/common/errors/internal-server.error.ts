import { DomainError } from '@domain/common/errors/domain.error';

export class InternalServerError extends DomainError {
  public constructor(message = 'Internal Server Error') {
    super(message);
  }
}
