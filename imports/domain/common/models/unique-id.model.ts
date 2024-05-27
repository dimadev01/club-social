import { Random } from 'meteor/random';

import { IUniqueIDModel } from '@domain/common/models/unique-id-model.interface';

export class UniqueIDModel implements IUniqueIDModel {
  public _id: string;

  protected constructor(props?: IUniqueIDModel) {
    this._id = props?._id ?? Random.id();
  }
}
