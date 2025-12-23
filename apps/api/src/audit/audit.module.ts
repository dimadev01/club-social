import { Module } from '@nestjs/common';

import { AUDIT_LOG_REPOSITORY_PROVIDER } from './domain/audit-log.repository';
import { AuditEventHandler } from './infrastructure/events/audit-event.handler';
import { PrismaAuditLogMapper } from './infrastructure/prisma-audit-log.mapper';
import { PrismaAuditLogRepository } from './infrastructure/prisma-audit-log.repository';

@Module({
  providers: [
    AuditEventHandler,
    PrismaAuditLogMapper,
    {
      provide: AUDIT_LOG_REPOSITORY_PROVIDER,
      useClass: PrismaAuditLogRepository,
    },
  ],
})
export class AuditModule {}
