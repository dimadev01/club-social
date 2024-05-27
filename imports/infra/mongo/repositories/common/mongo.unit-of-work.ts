import { MongoInternals } from 'meteor/mongo';
import type { ClientSession } from 'mongodb';
import { injectable } from 'tsyringe';

import { IUnitOfWork } from '@domain/common/repositories/unit-of-work.interface';

@injectable()
export class MontoUnitOfWork implements IUnitOfWork<ClientSession> {
  private _value: ClientSession;

  public constructor() {
    this._value =
      MongoInternals.defaultRemoteCollectionDriver().mongo.client.startSession();
  }

  public get(): ClientSession {
    return this._value;
  }

  public async withTransaction(
    callback: (session: ClientSession) => Promise<void>,
  ): Promise<void> {
    await this._value.withTransaction(callback);
  }
}
