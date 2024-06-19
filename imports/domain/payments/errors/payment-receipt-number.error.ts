import { DomainError } from '@domain/common/errors/domain.error';

export class PaymentReceiptNumberError extends DomainError {
  constructor() {
    super('El número de recibo de pago no puede ser negativo.');
  }
}
