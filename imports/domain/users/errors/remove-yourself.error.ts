export class RemoveYourselfError extends Error {
  public constructor() {
    super('No puedes eliminarte a ti mismo');
  }
}
