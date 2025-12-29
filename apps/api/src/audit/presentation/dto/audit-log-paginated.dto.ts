import {
  AuditAction,
  AuditEntity,
  AuditLogPaginatedDto,
} from '@club-social/shared/audit-logs';

export class AuditLogPaginatedResponseDto implements AuditLogPaginatedDto {
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
