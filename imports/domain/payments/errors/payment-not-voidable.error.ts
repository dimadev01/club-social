import { BaseError } from '@domain/common/errors/base.error';

export class PaymentNotVoidableError extends BaseError {
  constructor() {
    super('The payment is not voidable');
  }
}
