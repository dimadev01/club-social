import { AggregateRoot } from './aggregate-root';
import { UniqueId } from './value-objects/unique-id/unique-id.vo';

export interface AuditMeta {
  createdAt?: Date | null;
  createdBy?: null | string;
  updatedAt?: Date | null;
  updatedBy?: null | string;
}

export abstract class AuditedAggregateRoot extends AggregateRoot {
  public get createdAt(): Date | null | undefined {
    return this._audit.createdAt;
  }

  public get createdBy(): null | string | undefined {
    return this._audit.createdBy;
  }

  public get updatedAt(): Date | null | undefined {
    return this._audit.updatedAt;
  }

  public get updatedBy(): null | string | undefined {
    return this._audit.updatedBy;
  }

  protected _audit: AuditMeta;

  protected constructor(id?: UniqueId, audit: AuditMeta = {}) {
    super(id ?? UniqueId.generate());
    this._audit = audit;
  }

  protected markAsUpdated(updatedBy: string): void {
    this._audit = { ...this._audit, updatedBy };
  }
}
