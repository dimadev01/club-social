import { Module } from '@nestjs/common';

import { AUDIT_LOG_REPOSITORY_PROVIDER } from './domain/audit-log.repository';
import { AuditEventHandler } from './infrastructure/events/audit-event.handler';
import { PrismaAuditLogRepository } from './infrastructure/prisma-audit-log.repository';
import { AuditLogController } from './presentation/audit-log.controller';

@Module({
  controllers: [AuditLogController],
  providers: [
    AuditEventHandler,
    {
      provide: AUDIT_LOG_REPOSITORY_PROVIDER,
      useClass: PrismaAuditLogRepository,
    },
  ],
})
export class AuditModule {}
