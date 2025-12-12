import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './infrastructure/config/config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { EventsModule } from './infrastructure/events/events.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ObservabilityModule } from './infrastructure/observability/observability.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { TraceModule } from './infrastructure/trace/trace.module';
import { AuthModule } from './presentation/shared/auth/auth.module';
import { AllExceptionsFilter } from './presentation/shared/filters/all-exceptions.filter';
import { UsersModule } from './presentation/users/user.module';

@Module({
  controllers: [AppController],
  imports: [
    ObservabilityModule,
    ConfigModule,
    EventsModule,
    TraceModule,
    LoggerModule,
    DatabaseModule,
    AuthModule,
    StorageModule,

    /**
     * Domain
     */
    UsersModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
