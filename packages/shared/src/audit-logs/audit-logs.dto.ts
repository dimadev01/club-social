import { AuditAction, AuditEntity } from './audit-logs.enum';

export interface IAuditLogPaginatedDto {
  action: AuditAction;
  createdAt: string;
  createdBy: string;
  entity: AuditEntity;
  entityId: string;
  id: string;
  message: null | string;
  newData: null | Record<string, unknown>;
  oldData: null | Record<string, unknown>;
}
