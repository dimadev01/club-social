export class PriceNotFoundError extends Error {
  public constructor() {
    super('Precio no encontrado');
  }
}
