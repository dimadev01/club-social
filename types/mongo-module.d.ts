declare module 'meteor/mongo' {
  class MongoInternals {
    static defaultRemoteCollectionDriver(): any;
  }

  namespace Mongo {
    interface Collection<T, U = T> {
      attachSchema(schema: import('simpl-schema').default): void;
    }
  }
}
