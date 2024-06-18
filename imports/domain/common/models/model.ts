import { IModel } from './model.interface';

import { UniqueIDModel } from '@domain/common/models/unique-id.model';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';

export class Model extends UniqueIDModel implements IModel {
  public createdAt: DateTimeVo;

  public createdBy: string;

  public deletedAt: DateTimeVo | null;

  public deletedBy: string | null;

  public isDeleted: boolean;

  public updatedAt: DateTimeVo;

  public updatedBy: string;

  protected constructor(props?: IModel) {
    super(props);

    this.createdAt = props?.createdAt ?? new DateTimeVo();

    this.createdBy = props?.createdBy ?? 'System';

    this.deletedAt = props?.deletedAt ?? null;

    this.deletedBy = props?.deletedBy ?? null;

    this.isDeleted = props?.isDeleted ?? false;

    this.updatedAt = props?.updatedAt ?? new DateTimeVo();

    this.updatedBy = props?.updatedBy ?? 'System';
  }

  public update(updatedBy: string): void {
    this.updatedAt = new DateTimeVo();

    this.updatedBy = updatedBy;
  }

  public delete(deletedBy: string): void {
    this.isDeleted = true;

    this.deletedBy = deletedBy;

    this.deletedAt = new DateTimeVo();
  }
}
