export class RemoveAdminError extends Error {
  public constructor() {
    super('No puedes eliminar a un administrador');
  }
}
