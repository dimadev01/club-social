import { Controller, Get, Inject, Query } from '@nestjs/common';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { PaginatedRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedResponseDto } from '@/shared/presentation/dto/paginated-response.dto';

import {
  AUDIT_LOG_REPOSITORY_PROVIDER,
  type AuditLogRepository,
} from '../domain/audit-log.repository';
import { AuditLogPaginatedDto } from './dto/audit-log-paginated.dto';

@Controller('audit-logs')
export class AuditLogController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(AUDIT_LOG_REPOSITORY_PROVIDER)
    private readonly auditLogRepository: AuditLogRepository,
  ) {
    super(logger);
  }

  @ApiPaginatedResponse(AuditLogPaginatedDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<AuditLogPaginatedDto>> {
    const auditLogs = await this.auditLogRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: auditLogs.data.map((auditLog) => ({
        action: auditLog.action,
        createdAt: auditLog.createdAt.toISOString(),
        createdBy: auditLog.createdBy,
        entity: auditLog.entity,
        entityId: auditLog.entityId,
        id: auditLog.id,
        message: auditLog.message,
        newData: auditLog.newData,
        oldData: auditLog.oldData,
      })),
      total: auditLogs.total,
    };
  }
}
