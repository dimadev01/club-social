declare namespace Mongo {
  interface Collection<T, U = T> {
    attachSchema(schema: import('simpl-schema').default): void;
  }
}
