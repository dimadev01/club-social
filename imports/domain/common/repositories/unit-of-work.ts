export interface IUnitOfWork<T = unknown> {
  end(): Promise<void>;
  start(): void;
  value: T;
  withTransaction(
    callback: (session: IUnitOfWork) => Promise<void>,
  ): Promise<void>;
}
