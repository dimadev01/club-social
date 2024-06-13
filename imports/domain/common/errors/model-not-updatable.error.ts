import { DomainError } from '@domain/common/errors/base.error';

export class ModelNotUpdatableError extends DomainError {
  constructor() {
    super('Model is not updatable');
  }
}
