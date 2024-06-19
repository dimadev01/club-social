import { DomainError } from '@domain/common/errors/domain.error';

export class DueNotVoidableError extends DomainError {
  constructor() {
    super('La deuda no puede ser anulada.');
  }
}
