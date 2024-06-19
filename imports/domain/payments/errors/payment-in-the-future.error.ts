import { DomainError } from '@domain/common/errors/domain.error';

export class PaymentInTheFutureError extends DomainError {
  constructor() {
    super('El pago no puede ser en el futuro.');
  }
}
