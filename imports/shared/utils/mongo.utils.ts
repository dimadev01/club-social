import { MongoInternals } from 'meteor/mongo';
import type { ClientSession } from 'mongodb';

export abstract class MongoUtilsOld {
  public static elementAtArray0(
    path: string,
    defaultValue: string | number | boolean,
  ) {
    return { $ifNull: [{ $arrayElemAt: [path, 0] }, defaultValue] };
  }

  public static first(path: string, defaultValue: string | number | boolean) {
    return { $ifNull: [{ $first: path }, defaultValue] };
  }

  public static getGroupByAmount() {
    return { $group: { _id: null, amount: { $sum: '$amount' } } };
  }

  public static startSession(): ClientSession {
    return MongoInternals.defaultRemoteCollectionDriver().mongo.client.startSession();
  }
}
