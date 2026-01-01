import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

@Injectable()
export class TraceService {
  private readonly storage = new AsyncLocalStorage<string | undefined>();

  public create(): string {
    return randomUUID();
  }

  public get(): string | undefined {
    return this.storage.getStore();
  }

  public run<T>(traceId: string, fn: () => T): T {
    return this.storage.run(traceId, fn);
  }
}
