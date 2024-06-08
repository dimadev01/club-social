import { BaseError } from '@domain/common/errors/base.error';

export class ModelNotFoundError extends BaseError {
  public constructor() {
    super('Modelo no encontrado');
  }
}
