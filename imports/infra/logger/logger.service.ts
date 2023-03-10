import isEmpty from 'lodash/isEmpty';
// @ts-expect-error
import { Logger as OstrioLogger } from 'meteor/ostrio:logger';
// @ts-expect-error
import { LoggerConsole as OstrioLoggerConsole } from 'meteor/ostrio:loggerconsole';
// @ts-expect-error
import { LoggerMongo as OstrioLoggerMongo } from 'meteor/ostrio:loggermongo';
import { singleton } from 'tsyringe';
import { ILoggerFormat } from '@infra/logger/logger.types';

@singleton()
export class Logger {
  private readonly _logger;

  public constructor() {
    this._logger = new OstrioLogger();

    new OstrioLoggerConsole(this._logger, { highlight: true }).enable();

    const ostrioLoggerMongo = new OstrioLoggerMongo(this._logger, {
      collectionName: 'logs',
      format: (params: ILoggerFormat): ILoggerFormat => ({
        ...params,
        additional: isEmpty(params.additional) ? null : params.additional,
      }),
    }).enable();

    if (Meteor.isServer) {
      ostrioLoggerMongo.collection.createIndex({ date: -1, level: 1 });
    }
  }

  public info(message: string, ...meta: unknown[]): void {
    this._logger.info(message, ...meta);
  }

  public error(error: string | unknown, ...meta: unknown[]): void {
    if (error instanceof Error) {
      this._logger.error(error.message, { stack: error.stack, ...meta });
    } else if (typeof error === 'string') {
      this._logger.error(error, ...meta);
    } else {
      this._logger.error('Unknown error', ...meta);
    }
  }

  public debug(message: string, ...meta: unknown[]): void {
    this._logger.debug(message, ...meta);
  }

  public warn(message: string, ...meta: unknown[]): void {
    this._logger.warn(message, ...meta);
  }
}
