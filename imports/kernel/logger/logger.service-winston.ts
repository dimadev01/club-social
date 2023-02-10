import { singleton } from 'tsyringe';
import winston from 'winston';

@singleton()
export class LoggerWinston {
  private readonly _logger: winston.Logger;

  public constructor() {
    this._logger = winston.createLogger({
      exitOnError: true, // default
      level: 'debug',
      levels: winston.config.npm.levels, // default
      silent: false, // default
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.simple()
          ),
          handleExceptions: true,
          handleRejections: true,
        }),
      ],
    });
  }

  public info(message: string, ...meta: unknown[]): void {
    this._logger.info(message, ...meta);
  }

  public error(error: string | unknown, ...meta: unknown[]): void {
    if (error instanceof Error) {
      this._logger.error(error.message, ...meta);
    }

    if (typeof error === 'string') {
      this._logger.error(error, ...meta);
    }

    this._logger.error('Unknown error', ...meta);
  }

  public debug(message: string, ...meta: unknown[]): void {
    this._logger.debug(message, ...meta);
  }

  public warn(message: string, ...meta: unknown[]): void {
    this._logger.warn(message, ...meta);
  }
}
