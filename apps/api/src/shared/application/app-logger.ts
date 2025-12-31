export const APP_LOGGER_PROVIDER = Symbol('AppLogger');

export interface AppLogger {
  error(log: ErrorLog): void;
  info(log: Log): void;
  setContext(context: string): void;
  warn(log: Log): void;
}

export interface BaseLog {
  [key: string]: unknown;
  context?: string;
  method?: string;
}

export interface ErrorLog extends BaseLog {
  error: unknown;
  message?: string;
}

export interface Log extends BaseLog {
  message: string;
}
