export interface ILogger {
  debug(message: string, ...meta: unknown[]): void;
  error(error: string | unknown, ...meta: unknown[]): void;
  info(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
}
