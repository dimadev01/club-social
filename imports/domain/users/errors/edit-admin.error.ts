export class EditAdminError extends Error {
  public constructor() {
    super('No puedes editar a un administrador');
  }
}
