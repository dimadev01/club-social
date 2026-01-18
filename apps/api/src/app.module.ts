import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppSettingsModule } from './app-settings/app-settings.module';
import { AuditModule } from './audit/audit.module';
import { DuesModule } from './dues/due.module';
import { GroupModule } from './groups/group.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { ConfigModule } from './infrastructure/config/config.module';
import { CsvModule } from './infrastructure/csv/csv.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { EmailModule } from './infrastructure/email/email.module';
import { EventsModule } from './infrastructure/events/events.module';
import { HealthCheckModule } from './infrastructure/health-check/health-check.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ObservabilityModule } from './infrastructure/observability/observability.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { TraceModule } from './infrastructure/trace/trace.module';
import { MembersModule } from './members/member.module';
import { MovementsModule } from './movements/movement.module';
import { NotificationModule } from './notifications/notification.module';
import { PaymentsModule } from './payments/payment.module';
import { PricingModule } from './pricing/pricing.module';
import { AllExceptionsFilter } from './shared/presentation/filters/all-exceptions.filter';
import { UsersModule } from './users/user.module';

@Module({
  controllers: [],
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
    RedisModule,
    EmailModule,
    QueueModule,

    UsersModule,
    MembersModule,
    DuesModule,
    PaymentsModule,
    PricingModule,
    MovementsModule,
    GroupModule,
    AuditModule,
    AppSettingsModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
