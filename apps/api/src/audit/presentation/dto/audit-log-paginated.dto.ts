import {
  AuditAction,
  AuditEntity,
  IAuditLogPaginatedDto,
} from '@club-social/shared/audit-logs';

export class AuditLogPaginatedDto implements IAuditLogPaginatedDto {
  public action: AuditAction;
  public createdAt: string;
  public createdBy: string;
  public entity: AuditEntity;
  public entityId: string;
  public id: string;
  public message: null | string;
  public newData: null | Record<string, unknown>;
  public oldData: null | Record<string, unknown>;
}
