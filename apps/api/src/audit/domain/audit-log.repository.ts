import { AuditLogEntity } from './entities/audit-log.entity';

export const AUDIT_LOG_REPOSITORY_PROVIDER = Symbol(
  'AUDIT_LOG_REPOSITORY_PROVIDER',
);

export interface AuditLogRepository {
  save(entity: AuditLogEntity): Promise<void>;
}
