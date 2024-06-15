import { DomainError } from '@domain/common/errors/domain.error';

export class ModelNotFoundError extends DomainError {
  public constructor() {
    super('Model not found');
  }
}
