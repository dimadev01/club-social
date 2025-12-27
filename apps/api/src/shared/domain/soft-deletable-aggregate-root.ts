import { AuditedAggregateRoot, AuditMeta } from './audited-aggregate-root';
import { UniqueId } from './value-objects/unique-id/unique-id.vo';

export interface SoftDeleteMeta {
  deletedAt?: Date | null;
  deletedBy?: null | string;
}

export abstract class SoftDeletableAggregateRoot extends AuditedAggregateRoot {
  public get deletedAt(): Date | null | undefined {
    return this._deleted.deletedAt;
  }

  public get deletedBy(): null | string | undefined {
    return this._deleted.deletedBy;
  }

  protected _deleted: SoftDeleteMeta = {};

  protected constructor(
    id?: UniqueId,
    audit: AuditMeta = {},
    deleted: SoftDeleteMeta = {},
  ) {
    super(id, audit);
    this._deleted = deleted;
  }

  public delete(by: string, at: Date): void {
    this._deleted = { deletedAt: at, deletedBy: by };
  }

  public restore(by: string, at: Date): void {
    this._deleted = {};

    this._audit = { ...this._audit, updatedAt: at, updatedBy: by };
  }
}
