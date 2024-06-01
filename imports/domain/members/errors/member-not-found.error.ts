import { BaseError } from '@domain/common/errors/base.error';

export class MemberNotFoundError extends BaseError {
  public constructor() {
    super('Socio no encontrado');
  }
}
