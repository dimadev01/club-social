import { BaseError } from '@application/errors/error.base';

export class MemberNotFoundError extends BaseError {
  public constructor() {
    super('Socio no encontrado');
  }
}
