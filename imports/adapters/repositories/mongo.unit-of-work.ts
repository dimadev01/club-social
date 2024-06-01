import { MongoInternals } from 'meteor/mongo';
import type { ClientSession } from 'mongodb';
import { injectable } from 'tsyringe';

import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';

@injectable()
export class MongoUnitOfWork implements IUnitOfWork<ClientSession> {
  private _value: ClientSession | null;

  public constructor() {
    this._value = null;
  }

  public get(): ClientSession {
    if (!this._value) {
      throw new Error('Session not started');
    }

    return this._value;
  }

  public async end(): Promise<void> {
    await this.get().endSession();

    this._value = null;
  }

  public start(): void {
    this._value =
      MongoInternals.defaultRemoteCollectionDriver().mongo.client.startSession() as ClientSession;
  }

  public async withTransaction(
    callback: (session: ClientSession) => Promise<void>,
  ): Promise<void> {
    await this.get().withTransaction(() => callback(this.get()));
  }
}
