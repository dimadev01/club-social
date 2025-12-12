export class ApplicationError extends Error {
  public constructor(message: string, error?: Error) {
    super(message, { cause: error });
    this.name = new.target.name;
  }
}
