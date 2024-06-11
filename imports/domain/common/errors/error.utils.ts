export abstract class ErrorUtils {
  public static unknownToError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    return new Error(JSON.stringify(error));
  }
}
