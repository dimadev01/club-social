import { BaseError } from '@domain/common/errors/base.error';

export class DueNotVoidableError extends BaseError {
  constructor() {
    super('The due is not voidable');
  }
}
