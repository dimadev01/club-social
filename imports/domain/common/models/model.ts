import { IModelProps } from './model.interface';

import { UniqueIDModel } from '@domain/common/models/unique-id.model';

export class Model extends UniqueIDModel implements IModelProps {
  public createdAt: Date;

  public createdBy: string;

  public deletedAt: Date | null;

  public deletedBy: string | null;

  public isDeleted: boolean;

  public updatedAt: Date;

  public updatedBy: string;

  protected constructor(props?: IModelProps) {
    super(props);

    this.createdAt = props?.createdAt ?? new Date();

    this.createdBy = props?.createdBy ?? 'System';

    this.deletedAt = props?.deletedAt ?? null;

    this.deletedBy = props?.deletedBy ?? null;

    this.isDeleted = props?.isDeleted ?? false;

    this.updatedAt = props?.updatedAt ?? new Date();

    this.updatedBy = props?.updatedBy ?? 'System';
  }

  public update(updatedBy: string): void {
    this.updatedAt = new Date();

    this.updatedBy = updatedBy;
  }

  public delete(deletedBy: string): void {
    this.isDeleted = true;

    this.deletedBy = deletedBy;

    this.deletedAt = new Date();
  }
}
