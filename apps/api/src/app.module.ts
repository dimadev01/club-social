import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './infrastructure/config/config.module';
import { EventsModule } from './infrastructure/events/events.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { TraceModule } from './infrastructure/trace/trace.module';
import { UsersModule } from './presentation/users/users.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule,
    EventsModule,
    TraceModule,
    LoggerModule,

    /**
     * Domain
     */
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
