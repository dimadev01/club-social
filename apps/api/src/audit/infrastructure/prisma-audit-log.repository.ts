import { Inject, Injectable } from '@nestjs/common';

import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

import { AuditLogRepository } from '../domain/audit-log.repository';
import { AuditLogEntity } from '../domain/entities/audit-log.entity';

@Injectable()
export class PrismaAuditLogRepository implements AuditLogRepository {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly prisma: PrismaService,
    private readonly mappers: PrismaMappers,
  ) {
    this.logger.setContext(PrismaAuditLogRepository.name);
  }

  public async save(auditLog: AuditLogEntity): Promise<void> {
    const data = this.mappers.auditLog.toPersistence(auditLog);

    await this.prisma.auditLog.create({ data });
  }
}
