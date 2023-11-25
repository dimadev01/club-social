export class MovementNotFoundError extends Error {
  public constructor() {
    super('Movimiento no encontrado');
  }
}
