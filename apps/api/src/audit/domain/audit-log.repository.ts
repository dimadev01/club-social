import { AuditAction, AuditEntity } from '@club-social/shared/audit-logs';
import { PaginatedRequest, PaginatedResponse } from '@club-social/shared/types';

import { AuditLogCreateInput } from '@/infrastructure/database/prisma/generated/models';

export const AUDIT_LOG_REPOSITORY_PROVIDER = Symbol(
  'AUDIT_LOG_REPOSITORY_PROVIDER',
);
export interface AuditLogEntry {
  action: AuditAction;
  createdAt: Date;
  createdBy: string;
  entity: AuditEntity;
  entityId: string;
  id: string;
  message: null | string;
  newData: null | Record<string, unknown>;
  oldData: null | Record<string, unknown>;
}

export interface AuditLogRepository {
  append(entry: AuditLogCreateInput): Promise<void>;
  findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<AuditLogEntry>>;
}
