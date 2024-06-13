import { DomainError } from '@domain/common/errors/base.error';

export class ModelNotFoundError extends DomainError {
  public constructor() {
    super('Modelo no encontrado');
  }
}
