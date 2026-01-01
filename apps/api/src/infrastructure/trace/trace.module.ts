import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { TraceMiddleware } from './trace.middleware';
import { TraceService } from './trace.service';

@Module({
  exports: [TraceService],
  providers: [TraceService],
})
export class TraceModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
