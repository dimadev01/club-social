import { ClsStore, ClsService as NestJsClsService } from 'nestjs-cls';

export interface AsyncLocalStorageStore extends ClsStore {
  headers: Headers;
}

export class ClsService extends NestJsClsService<AsyncLocalStorageStore> {}
