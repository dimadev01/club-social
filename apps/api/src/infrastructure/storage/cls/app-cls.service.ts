import { ClsService, ClsStore } from 'nestjs-cls';

export interface AsyncLocalStorageStore extends ClsStore {
  headers: Headers;
}

export class AppClsService extends ClsService<AsyncLocalStorageStore> {}
