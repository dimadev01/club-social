import { AuditAction, AuditEntity } from '@club-social/shared/audit-logs';
import {
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';
import { Inject, Injectable } from '@nestjs/common';

import {
  AuditLogCreateInput,
  AuditLogFindManyArgs,
  AuditLogWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { DateRange } from '@/shared/domain/value-objects/date-range';

import {
  AuditLogEntry,
  AuditLogRepository,
} from '../domain/audit-log.repository';

@Injectable()
export class PrismaAuditLogRepository implements AuditLogRepository {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(PrismaAuditLogRepository.name);
  }

  public async append(entry: AuditLogCreateInput): Promise<void> {
    await this.prisma.auditLog.create({ data: entry });
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<PaginatedDataResultDto<AuditLogEntry>> {
    const where: AuditLogWhereInput = {};

    if (params.filters?.createdAt) {
      const dateRangeResult = DateRange.fromUserInput(
        params.filters.createdAt[0],
        params.filters.createdAt[1],
      );

      if (dateRangeResult.isErr()) {
        throw dateRangeResult.error;
      }

      where.createdAt = {
        gte: dateRangeResult.value.start,
        lt: dateRangeResult.value.end,
      };
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
      data: data.map((data) => ({
        action: data.action as AuditAction,
        createdAt: data.createdAt,
        createdBy: data.createdBy,
        entity: data.entity as AuditEntity,
        entityId: data.entityId,
        id: data.id,
        message: data.message,
        newData: data.newData as Record<string, unknown>,
        oldData: data.oldData as Record<string, unknown>,
      })),
      total,
    };
  }
}
