import { DomainError } from '@domain/common/errors/domain.error';

export class DuePaymentInTheFutureError extends DomainError {
  public constructor() {
    super('El pago no puede ser en el futuro');
  }
}
