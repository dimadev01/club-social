import { PaginatedRequest, PaginatedResponse } from '@club-social/shared/types';

import { AuditLogEntity } from './entities/audit-log.entity';

export const AUDIT_LOG_REPOSITORY_PROVIDER = Symbol(
  'AUDIT_LOG_REPOSITORY_PROVIDER',
);

export interface AuditLogRepository {
  findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<AuditLogEntity>>;
  save(entity: AuditLogEntity): Promise<void>;
}
