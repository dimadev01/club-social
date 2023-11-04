import { MongoInternals } from 'meteor/mongo';
import type { ClientSession } from 'mongodb';

export abstract class MongoUtils {
  static startSession(): ClientSession {
    return MongoInternals.defaultRemoteCollectionDriver().mongo.client.startSession();
  }
}
