export class AtLeastOneEmailInUseError extends Error {
  public constructor() {
    super('Al menos un email ya está en uso por otro usuario');
  }
}
