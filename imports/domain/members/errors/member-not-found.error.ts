export class MemberNotFoundError extends Error {
  public constructor() {
    super('Socio no encontrado');
  }
}
