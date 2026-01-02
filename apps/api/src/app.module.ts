import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppSettingsModule } from './app-settings/app-settings.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { DuesModule } from './dues/due.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { ConfigModule } from './infrastructure/config/config.module';
import { CsvModule } from './infrastructure/csv/csv.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { EventsModule } from './infrastructure/events/events.module';
import { HealthCheckModule } from './infrastructure/health-check/health-check.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ObservabilityModule } from './infrastructure/observability/observability.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { TraceModule } from './infrastructure/trace/trace.module';
import { MembersModule } from './members/member.module';
import { MovementsModule } from './movements/movement.module';
import { PaymentsModule } from './payments/payment.module';
import { PricingModule } from './pricing/pricing.module';
import { AllExceptionsFilter } from './shared/presentation/filters/all-exceptions.filter';
import { UsersModule } from './users/user.module';

@Module({
  controllers: [AppController],
  imports: [
    ObservabilityModule,
    ConfigModule,
    CsvModule,
    EventsModule,
    LoggerModule,
    TraceModule,
    DatabaseModule,
    AuthModule,
    HealthCheckModule,
    StorageModule,
    CacheModule,

    UsersModule,
    MembersModule,
    DuesModule,
    PaymentsModule,
    PricingModule,
    MovementsModule,
    AuditModule,
    AppSettingsModule,
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
