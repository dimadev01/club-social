import { AuditMeta } from './audited-aggregate-root';
import { UniqueId } from './value-objects/unique-id/unique-id.vo';

export interface PersistenceMeta {
  audit: AuditMeta;
  id: UniqueId;
}
