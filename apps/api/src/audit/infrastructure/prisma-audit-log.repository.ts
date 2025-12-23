import { AuditAction, AuditEntity } from '@club-social/shared/audit-logs';
import { PaginatedRequest, PaginatedResponse } from '@club-social/shared/types';
import { Inject, Injectable } from '@nestjs/common';

import {
  AuditLogFindManyArgs,
  AuditLogWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { DateRange } from '@/shared/domain/value-objects/date-range';

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

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<AuditLogEntity>> {
    const where: AuditLogWhereInput = {};

    if (params.filters?.createdAt) {
      const dateRangeResult = DateRange.fromUserInput(
        params.filters.createdAt[0],
        params.filters.createdAt[1],
      );

      if (dateRangeResult.isErr()) {
        throw dateRangeResult.error;
      }

      where.createdAt = dateRangeResult.value.toPrismaFilter();
    }

    if (params.filters?.entity) {
      where.entity = { in: params.filters.entity as AuditEntity[] };
    }

    if (params.filters?.action) {
      where.action = { in: params.filters.action as AuditAction[] };
    }

    const query = {
      orderBy: params.sort.map(({ field, order }) => ({ [field]: order })),
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies AuditLogFindManyArgs;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany(query),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: data.map((data) => this.mappers.auditLog.toDomain(data)),
      total,
    };
  }

  public async save(auditLog: AuditLogEntity): Promise<void> {
    const data = this.mappers.auditLog.toPersistence(auditLog);

    await this.prisma.auditLog.create({ data });
  }
}
