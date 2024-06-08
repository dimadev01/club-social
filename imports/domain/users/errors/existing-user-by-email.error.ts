import { BaseError } from '@domain/common/errors/base.error';

export class ExistingUserByEmailError extends BaseError {
  public constructor(email: string) {
    super(`Ya existe un usuario con el email ${email}`);
  }
}
