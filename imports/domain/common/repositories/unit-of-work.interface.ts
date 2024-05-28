export interface IUnitOfWork<T> {
  end(): Promise<void>;
  get(): T;
  start(): void;
  withTransaction(callback: (session: T) => Promise<void>): Promise<void>;
}
