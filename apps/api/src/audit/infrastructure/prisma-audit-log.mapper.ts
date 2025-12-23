import type { InputJsonValue } from '@prisma/client/runtime/client';

import { AuditAction, AuditEntity } from '@club-social/shared/audit-logs';
import { Injectable } from '@nestjs/common';

import {
  AuditLogCreateInput,
  AuditLogModel,
} from '@/infrastructure/database/prisma/generated/models';

import { AuditLogEntity } from '../domain/entities/audit-log.entity';

@Injectable()
export class PrismaAuditLogMapper {
  public toDomain(model: AuditLogModel): AuditLogEntity {
    return AuditLogEntity.fromPersistence({
      action: model.action as AuditAction,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      entity: model.entity as AuditEntity,
      entityId: model.entityId,
      id: model.id,
      message: model.message,
      newData: model.newData as null | Record<string, unknown>,
      oldData: model.oldData as null | Record<string, unknown>,
    });
  }

  public toPersistence(entity: AuditLogEntity): AuditLogCreateInput {
    return {
      action: entity.action as AuditLogCreateInput['action'],
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      entity: entity.entity as AuditLogCreateInput['entity'],
      entityId: entity.entityId,
      id: entity.id,
      message: entity.message,
      newData: entity.newData as InputJsonValue | undefined,
      oldData: entity.oldData as InputJsonValue | undefined,
    };
  }
}
