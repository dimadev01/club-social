export interface IUnitOfWork<T> {
  get(): T;
  withTransaction(callback: (session: T) => Promise<void>): Promise<void>;
}
