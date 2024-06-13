import { DomainError } from '@domain/common/errors/base.error';

export class PaymentNotVoidableError extends DomainError {
  constructor() {
    super('The payment is not voidable');
  }
}
