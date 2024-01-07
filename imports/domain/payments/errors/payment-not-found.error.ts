export class PaymentNotFoundError extends Error {
  public constructor() {
    super('Pago no encontrado');
  }
}
