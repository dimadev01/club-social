import { Global, Module } from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';
import { ClsModule, ClsService as NestJsClsService } from 'nestjs-cls';

import { ClsService } from './cls/cls.service';

@Global()
@Module({
  exports: [ClsService],
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls: ClsService, req: Request) => {
          cls.set('headers', fromNodeHeaders(req.headers));
        },
      },
    }),
  ],
  providers: [
    {
      provide: ClsService,
      useExisting: NestJsClsService,
    },
  ],
})
export class StorageModule {}
