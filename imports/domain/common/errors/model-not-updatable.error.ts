import { BaseError } from '@domain/common/errors/base.error';

export class ModelNotUpdatableError extends BaseError {
  constructor() {
    super('Model is not updatable');
  }
}
