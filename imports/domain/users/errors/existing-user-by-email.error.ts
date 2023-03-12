export class ExistingUserByEmailError extends Error {
  public constructor(email: string) {
    super(`Ya existe un usuario con el email ${email}`);
  }
}
