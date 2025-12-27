import { AuditedAggregateRoot } from './audited-aggregate-root';

export interface SoftDeleteMeta {
  deletedAt?: Date;
  deletedBy?: string;
}

export abstract class SoftDeletableAggregateRoot extends AuditedAggregateRoot {
  protected deleted: SoftDeleteMeta = {};

  public delete(by: string, at: Date): void {
    this.deleted = { deletedAt: at, deletedBy: by };
  }

  public restore(by: string, at: Date): void {
    this.deleted = {};

    this.audit = { ...this.audit, updatedAt: at, updatedBy: by };
  }
}
