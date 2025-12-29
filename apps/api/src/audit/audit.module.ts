import { Module } from '@nestjs/common';

import { AuditEventHandler } from './infrastructure/events/audit-event.handler';
import { AuditLogController } from './presentation/audit-log.controller';

@Module({
  controllers: [AuditLogController],
  providers: [AuditEventHandler],
})
export class AuditModule {}
