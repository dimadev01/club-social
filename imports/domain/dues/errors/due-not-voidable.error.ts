import { DomainError } from '@domain/common/errors/base.error';

export class DueNotVoidableError extends DomainError {
  constructor() {
    super('The due is not voidable');
  }
}
