import { Module } from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';
import { ClsModule, ClsService } from 'nestjs-cls';

import { AppClsService, AsyncLocalStorageStore } from './cls/app-cls.service';

@Module({
  exports: [AppClsService],
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls: ClsService<AsyncLocalStorageStore>, req: Request) => {
          cls.set('headers', fromNodeHeaders(req.headers));
        },
      },
    }),
  ],
  providers: [
    {
      provide: AppClsService,
      useExisting: ClsService,
    },
  ],
})
export class StorageModule {}
