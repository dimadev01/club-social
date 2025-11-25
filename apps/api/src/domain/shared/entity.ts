import type { UniqueId } from './value-objects/unique-id/unique-id.vo';

import { AggregateRoot } from './aggregate-root';

export interface BaseEntityProps {
  createdAt: Date | null;
  createdBy: null | string;
  deletedAt: Date | null;
  deletedBy: null | string;
  id: UniqueId;
  isDeleted: boolean;
  updatedAt: Date | null;
  updatedBy: null | string;
}

export abstract class Entity<T> extends AggregateRoot<T> {
  public get createdAt(): Date {
    return new Date(this._createdAt);
  }

  public get createdBy(): string {
    return this._createdBy;
  }

  public get deletedAt(): Date | null {
    return this._deletedAt ? new Date(this._deletedAt) : null;
  }

  public get deletedBy(): null | string {
    return this._deletedBy;
  }

  public get isDeleted(): boolean {
    return this._isDeleted;
  }

  public get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  public get updatedBy(): string {
    return this._updatedBy;
  }

  protected _createdAt: Date;
  protected _createdBy: string;
  protected _deletedAt: Date | null;
  protected _deletedBy: null | string;
  protected _isDeleted: boolean;
  protected _updatedAt: Date;
  protected _updatedBy: string;

  protected constructor(props?: BaseEntityProps) {
    super(props?.id);

    this._createdAt = props?.createdAt ?? new Date();
    this._createdBy = props?.createdBy ?? 'System';
    this._deletedAt = props?.deletedAt ?? null;
    this._deletedBy = props?.deletedBy ?? null;
    this._isDeleted = props?.isDeleted ?? false;
    this._updatedAt = props?.updatedAt ?? this._createdAt;
    this._updatedBy = props?.updatedBy ?? this._createdBy;
  }

  public delete(deletedBy = 'System'): void {
    this._isDeleted = true;
    this._deletedAt = new Date();
    this._deletedBy = deletedBy;
    this.markAsUpdated();
  }

  public markAsUpdated(updatedBy = 'System'): void {
    this._updatedAt = new Date();
    this._updatedBy = updatedBy;
  }

  public restore(by = 'System'): void {
    this._isDeleted = false;
    this.markAsUpdated(by);
  }
}
