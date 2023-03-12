export class CategoryNotFoundError extends Error {
  public constructor() {
    super('Categoría no encontrada');
  }
}
