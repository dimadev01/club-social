import { DomainError } from '@domain/common/errors/domain.error';

export class ExistingUserByEmailError extends DomainError {
  public constructor(email: string) {
    super(`Ya existe un usuario con el email ${email}`);
  }
}
