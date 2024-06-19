import { DomainError } from '@domain/common/errors/domain.error';

export class DuePaymentAlreadyVoidedError extends DomainError {
  constructor() {
    super('El pago ya ha sido anulado.');
  }
}
