import { AuditAction, AuditEntity } from '@club-social/shared/audit';

import { CreateAuditLogProps } from '../interfaces/audit-log.interface';

interface AuditLogProps {
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

export class AuditLogEntity {
  public get action(): AuditAction {
    return this._action;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get createdBy(): string {
    return this._createdBy;
  }

  public get entity(): AuditEntity {
    return this._entity;
  }

  public get entityId(): string {
    return this._entityId;
  }

  public get id(): string {
    return this._id;
  }

  public get message(): null | string {
    return this._message;
  }

  public get newData(): null | Record<string, unknown> {
    return this._newData;
  }

  public get oldData(): null | Record<string, unknown> {
    return this._oldData;
  }

  private readonly _action: AuditAction;
  private readonly _createdAt: Date;
  private readonly _createdBy: string;
  private readonly _entity: AuditEntity;
  private readonly _entityId: string;
  private readonly _id: string;
  private readonly _message: null | string;
  private readonly _newData: null | Record<string, unknown>;
  private readonly _oldData: null | Record<string, unknown>;

  private constructor(props: AuditLogProps) {
    this._id = props.id;
    this._createdAt = props.createdAt;
    this._createdBy = props.createdBy;
    this._entity = props.entity;
    this._entityId = props.entityId;
    this._action = props.action;
    this._message = props.message;
    this._oldData = props.oldData;
    this._newData = props.newData;
  }

  public static create(props: CreateAuditLogProps): AuditLogEntity {
    return new AuditLogEntity({
      action: props.action,
      createdAt: new Date(),
      createdBy: props.createdBy,
      entity: props.entity,
      entityId: props.entityId,
      id: crypto.randomUUID(),
      message: props.message,
      newData: props.newData,
      oldData: props.oldData,
    });
  }

  public static fromPersistence(props: AuditLogProps): AuditLogEntity {
    return new AuditLogEntity(props);
  }
}
