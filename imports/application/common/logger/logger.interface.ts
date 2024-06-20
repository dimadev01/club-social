export interface ILoggerService {
  debug(message: string, ...meta: unknown[]): void;
  error(error: string | Error | unknown, ...meta: unknown[]): void;
  info(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
}
