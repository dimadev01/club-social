import { AuditAction, AuditEntity } from '@club-social/shared/audit';

export interface CreateAuditLogProps {
  action: AuditAction;
  createdBy: string;
  entity: AuditEntity;
  entityId: string;
  message: null | string;
  newData: null | Record<string, unknown>;
  oldData: null | Record<string, unknown>;
}
