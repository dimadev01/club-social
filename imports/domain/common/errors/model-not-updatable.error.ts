import { DomainError } from '@domain/common/errors/domain.error';

export class ModelNotUpdatableError extends DomainError {
  constructor() {
    super('Model is not updatable');
  }
}
