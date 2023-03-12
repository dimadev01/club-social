export class UserNotFoundError extends Error {
  public constructor() {
    super('Usuario no encontrado');
  }
}
